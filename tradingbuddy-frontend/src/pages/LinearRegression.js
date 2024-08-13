import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { AgChartsReact } from 'ag-charts-react';
import { Box, Button, CircularProgress, IconButton, InputBase, MenuItem, Paper, Select, Stack } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import logo from 'assets/images/icons/tbLogo.png';
import './mt4tools/index.css';
import 'react-datepicker/dist/react-datepicker.css';

const LinearRegression = () => {
    const dayInMills = 1000 * 60 * 60 * 24;
    const [loading, setLoading] = useState(false);
    const [symbol, setSymbol] = useState("AAPL");
    const [interval, setMyInterval] = useState('30min');
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').toDate());
    const [endDate, setEndDate] = useState(new Date());
    const [dates, setDates] = useState([]);
    const [stockData, setStockData] = useState({});
    const [chartData, setChartData] = useState([]);
    const [regressionChartData, setRegressionChartData] = useState([]);

    const fetchData = async () => {
        const options = {
            method: 'GET',
            url: 'https://alpha-vantage.p.rapidapi.com/query',
            params: {
                time_period: 5,
                interval: interval,
                series_type: 'close',
                function: 'SMA',
                symbol: `${symbol}`,
                datatype: 'json'
            },
            headers: {
                'X-RapidAPI-Key': `${process.env.REACT_APP_RapidAPI_Key}`,
                'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            setStockData(response.data['Technical Analysis: SMA']);
        } catch (error) {
            console.error(error);
        }
    };

    const findPeaks = (allDates, data, threshold) => {
        const res = [];
        let cur = data[0];
        res.push(0);
        for (let i = 0; i < data.length; i++) {
            if (res.length >= 2 && data[res[res.length - 2]] > data[res[res.length - 1]] && data[res[res.length - 1]] > data[i])
                res[res.length - 1] = i, cur = data[i];
            if (res.length >= 2 && data[res[res.length - 2]] < data[res[res.length - 1]] && data[res[res.length - 1]] < data[i])
                res[res.length - 1] = i, cur = data[i];
            else if (Math.abs(data[i] - cur) > threshold) {
                cur = data[i];
                res.push(i)
            }
        }
        if (new Date(allDates[allDates.length - 1]).getDate() - new Date(allDates[res[res.length - 1]]).getDate() < 2) {
            res.pop();
            res.push(data.length - 1);
        } else {
            res.push(data.length - 1);
        }
        return res;
    }

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [interval]);

    useEffect(() => {
        let dateItems = [];
        const days = Math.ceil((endDate - startDate) / (dayInMills)) + 1;

        for (let i = 0; i < days; i++) {
            const date = moment(startDate).add(i, 'days');
            const dayOfWeek = date.format('dddd');

            if (dayOfWeek !== 'Saturday' && dayOfWeek !== 'Sunday') {
                const formattedDate = date.format('YYYY-MM-DD');
                dateItems.push(formattedDate);
            }
        }
        setDates(dateItems);
        setLoading(true);
        fetchData();
    }, [startDate, endDate]);

    useEffect(() => {
        if (typeof stockData !== 'undefined' && Object.keys(stockData).length > 0) {
            const chart = Object.entries(stockData).map(([key, value]) => {
                if (dates.includes(key.split(" ")[0])) {
                    return {
                        date: new Date(key).getTime(),
                        SMA: parseFloat(value.SMA)
                    }
                }
                return null;
            }).filter(item => item !== null).reverse();


            const allDates = Object.entries(stockData).map(([key]) => {
                if (dates.includes(key.split(" ")[0])) {
                    return new Date(key).getTime()
                }
                return null;
            }).filter(item => item !== null).reverse();

            const SMS = Object.entries(stockData).map(([key, value]) => {
                if (dates.includes(key.split(" ")[0])) {
                    return parseFloat(value.SMA)
                }
                return null;
            }).filter(item => item !== null).reverse();

            const maxSMS = SMS.reduce((max, current) => Math.max(max, current), -Infinity);
            const minSMS = SMS.reduce((min, current) => Math.min(min, current), Infinity);
            const threshold = (maxSMS - minSMS) / 10;
            const allSignificiantIndicies = findPeaks(allDates, SMS, threshold);

            const extremelySignificiantDates = allSignificiantIndicies.map((i) => allDates.at(i));
            const extremelySignificiantSMS = allSignificiantIndicies.map((i) => SMS.at(i));

            const sortedIndices = extremelySignificiantDates.map((date, i) => [date, extremelySignificiantSMS[i]])
                .sort((a, b) => a[0] - b[0]);

            const prepareSortedIndicesData = () => {
                return sortedIndices.map(([date, SMA], index) => ({ date, SMA, index }));
            };

            setLoading(false);
            setChartData(chart);
            setRegressionChartData(prepareSortedIndicesData());
        }
    }, [stockData]);

    return (
        <div className='tradingview-widget-container' style={{ height: '100%' }}>
            <div className='tradingview-widget-container__widget' style={{ height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" style={{ height: '10%' }}>
                    <div style={{ display: 'flex', height: '70px,', textAlign: 'center', paddingLeft: '20px' }}>
                        <img src={logo} alt="logo" style={{ width: '60px', height: '60px' }}></img>
                        <div
                            style={{
                                textAlign: 'center',
                                alignItems: 'center',
                                paddingLeft: '10px',
                                display: 'flex',
                                fontSize: '20px',
                                color: 'rgb(189, 189, 189)'
                            }}
                        >
                            Linear Regression
                        </div>
                    </div>
                    <Box sx={{ color: 'green', fontSize: '16px' }}>{symbol.toUpperCase()}</Box>
                    <div style={{ display: 'flex' }}>
                        <DatePicker className="stockdatepicker" selected={startDate} onChange={(date) => setStartDate(date)} />
                        <DatePicker className="stockdatepicker" selected={endDate} onChange={(date) => setEndDate(date)} />
                        <Select
                            value={interval}
                            onChange={(e) => {
                                setMyInterval(e.target.value);
                            }}
                            sx={{
                                '& .MuiSelect-icon': { color: '#bdbdbd' },
                                color: '#bdbdbd'
                            }}
                        >
                            <MenuItem value="5min">5 minutes</MenuItem>
                            <MenuItem value="30min">30 minutes</MenuItem>
                            <MenuItem value="60min">1 hour</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                    </div>
                    <Box sx={{ marginLeft: '30px', marginRight: '30px' }}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="baseline" spacing={2}>
                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                                spacing={2}
                                sx={{ alignItems: 'center', paddingTop: '15px', paddingBottom: '10px' }}
                            >
                                <Paper
                                    sx={{ p: '2px', display: 'flex', alignItems: 'center', width: 200 }}
                                    style={{ marginRight: '10px', background: '#2a2e39' }}
                                    onChange={(e) => {
                                        setSymbol(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                            setSymbol(symbol);
                                            fetchData();
                                        }
                                    }}
                                >
                                    <IconButton type="button" sx={{ p: '10px' }} aria-label="Symbol">
                                        <SearchIcon style={{ color: '#d1d4dc' }} />
                                    </IconButton>
                                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Symbol" style={{ color: '#d1d4dc' }} />
                                </Paper>
                                <Button
                                    variant="contained"
                                    style={{ marginRight: '10px', background: '#2962ff' }}
                                    onClick={() => {
                                        setSymbol(symbol);
                                        fetchData();
                                    }}
                                >
                                    Submit
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
                {!loading ? (
                    <div style={{ height: '90%' }}>
                        <AgChartsReact
                            options={{
                                autoSize: true,
                                data: [],
                                series: [
                                    {
                                        type: 'line',
                                        xKey: 'date',
                                        yKey: 'SMA',
                                        data: chartData,
                                        title: 'Daily SMA',
                                        marker: {
                                            enabled: true,
                                            size: 1
                                        }
                                    },
                                    {
                                        type: 'line',
                                        xKey: 'date',
                                        yKey: 'SMA',
                                        data: regressionChartData,
                                        title: 'Linear Regression',
                                        marker: {
                                            enabled: true,
                                            size: 8,
                                            shape: 'diamond',
                                            fill: '#ff0000'
                                        },
                                        label: {
                                            enabled: true,
                                            fontSize: 19,
                                            color: '#ffffff',
                                            formatter: function (params) {
                                                const currentIndex = params.datum.index;
                                                const previousDatum = currentIndex > 0 ? regressionChartData[currentIndex - 1] : null;
                                                const doublePreviousDatum = currentIndex > 1 ? regressionChartData[currentIndex - 2] : null;
                                                if (currentIndex > 1) {
                                                    if (previousDatum !== null && doublePreviousDatum !== null) {
                                                        if (params.datum.SMA - previousDatum.SMA > 0) {
                                                            return `+${Math.abs((params.datum.SMA - previousDatum.SMA) / (previousDatum.SMA - doublePreviousDatum.SMA) * 100).toFixed(2)}%`;
                                                        } else {
                                                            return `-${Math.abs((params.datum.SMA - previousDatum.SMA) / (previousDatum.SMA - doublePreviousDatum.SMA) * 100).toFixed(2)}%`;
                                                        }
                                                    } else {
                                                        return `Index: ${currentIndex} (Value: ${params.datum.SMA})`;
                                                    }
                                                } else {
                                                    return '';
                                                }
                                            }
                                        }
                                    }
                                ],
                                background: {
                                    fill: '#1e222d'
                                },
                                axes: [
                                    {
                                        type: 'time',
                                        position: 'bottom',
                                        label: {
                                            color: '#D1D4DC'
                                        },
                                        tick: {
                                            format: '%Y-%M-%D'
                                        }
                                    },
                                    {
                                        type: 'number',
                                        position: 'left',
                                        title: {
                                            text: '',
                                            color: '#D1D4DC'
                                        },
                                        label: {
                                            color: '#D1D4DC'
                                        },
                                    },
                                    {
                                        type: 'number',
                                        position: 'right',
                                        title: {
                                            text: 'Linear Regression',
                                            color: '#D1D4DC'
                                        },
                                        label: {
                                            color: '#D1D4DC'
                                        },
                                    },
                                ],
                            }}
                        />
                    </div>
                ) : (<CircularProgress style={{ position: 'absolute', top: '40%', left: '50%' }} />)}
            </div>
        </div>
    )
}

export default LinearRegression;
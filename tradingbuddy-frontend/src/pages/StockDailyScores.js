/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import { Box, IconButton, Button, InputBase, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from 'assets/images/icons/tbLogo.png';
import 'react-datepicker/dist/react-datepicker.css';
import './mt4tools/index.css';
import DatePicker from 'react-datepicker';

const formatter = ({ yKey, size }) => {
  return { size: yKey === 'pscore' ? 12 : size };
};

const StockDailyScores = () => {
  const CLOSE = {
    type: 'line',
    xKey: 'day',
    yKey: 'close',
    yName: 'Close'
  };

  const PSCORE = {
    type: 'bar',
    xKey: 'day',
    yKey: 'pscore',
    yName: 'Pscore',
    color: 'red',
    marker: { formatter },
    label: {
      enabled: true,
      formatter: ({ value }) => value.toFixed(0),
      color: '#D1D4DC'
    }
  };

  const BAR_AND_LINE = [
    { ...PSCORE, type: 'bar' },
    { ...CLOSE, type: 'line' }
  ];

  const dateItems = [];
  const [stockData, setStockData] = useState({});
  const [pscore, setPscore] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [symbolTemp, setSymbolTemp] = useState('AAPL');
  const [startDate, setStartDate] = useState(moment().subtract(15, 'days').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [dates, setDates] = useState([]);

  const formatDate = (dateString) => moment.utc(dateString).format('YYYY-MM-DD');

  useEffect(() => {
    fetchData();
    getPscoreData();
  }, []);

  const fetchData = async () => {
    const options = {
      method: 'GET',
      url: 'https://alpha-vantage.p.rapidapi.com/query',
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: `${symbol}`,
        outputsize: 'compact',
        datatype: 'json'
      },
      headers: {
        'X-RapidAPI-Key': `${process.env.REACT_APP_RapidAPI_Key}`,
        'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setStockData(response.data['Time Series (Daily)']);
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            // handle error case for 403
            toast.error('You are not subscribed to this API.');
            break;
          default:
            toast.error(error);
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
    }
  };

  const getPscoreData = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('symbol', symbol);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/activity/getPscore_symbol`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        setPscore(res.data);
      })
      .catch((res) => {
        toast.error(res.message);
      });
  };

  useEffect(() => {
    // Calculate the number of days between startDate and endDate
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Populate the dateItems array with the dates from startDate to endDate, excluding weekends
    for (let i = 0; i < days; i++) {
      const date = moment(startDate).add(i, 'days');
      const dayOfWeek = date.format('dddd');

      // Exclude weekends (Saturday or Sunday)
      if (dayOfWeek !== 'Saturday' && dayOfWeek !== 'Sunday') {
        const formattedDate = date.format('YYYY-MM-DD');
        dateItems.push(formattedDate);
      }
    }
    setDates(dateItems);
    fetchData();
    getPscoreData();
  }, [startDate, endDate]);

  useEffect(() => {
    if (typeof stockData !== 'undefined' && Object.keys(stockData).length > 0 && typeof pscore !== 'undefined' && pscore.length > 0)
      setChartData(
        dates.map((item) => {
          return {
            day: item,
            close: Number(stockData[item] ? stockData[item]['4. close'] : NaN),
            pscore: pscore.find((pscoreItem) => formatDate(pscoreItem[0]) === item)?.[2]
          };
        })
      );
  }, [stockData, pscore]);
  return (
    <div className="tradingview-widget-container" style={{ height: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: '100%' }}>
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
              Stock Performance Scores
            </div>
          </div>
          <Box sx={{ color: 'green', fontSize: '16px' }}>{symbolTemp.toUpperCase()}</Box>
          <div style={{ display: 'flex' }}>
            <DatePicker className="stockdatepicker" selected={startDate} onChange={(date) => setStartDate(date)} />
            <DatePicker className="stockdatepicker" selected={endDate} onChange={(date) => setEndDate(date)} />
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
                      setSymbolTemp(symbol);
                      getPscoreData();
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
                    setSymbolTemp(symbol);
                    getPscoreData();
                    fetchData();
                  }}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <div style={{ height: '90%' }}>
          <AgChartsReact
            options={{
              data: chartData || [],
              series: BAR_AND_LINE,
              background: {
                fill: '#1e222d'
              },
              axes: [
                {
                  type: 'category',
                  position: 'bottom',
                  label: {
                    color: '#D1D4DC'
                  }
                },
                {
                  // primary y axis
                  type: 'number',
                  position: 'left',
                  keys: ['close'],
                  title: {
                    text: 'CLOSE',
                    color: '#D1D4DC'
                  },
                  label: {
                    color: '#D1D4DC'
                  }
                },
                {
                  // secondary y axis
                  type: 'number',
                  position: 'right',
                  keys: ['pscore'],
                  title: {
                    text: 'PSCORE',
                    color: '#D1D4DC'
                  },
                  label: {
                    color: '#D1D4DC'
                  }
                }
              ]
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StockDailyScores;

/* eslint-disable */

/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Box, Stack } from '@mui/material';
import logo from 'assets/images/icons/tbLogo.png';
import 'react-datepicker/dist/react-datepicker.css';
import './mt4tools/index.css';
import DatePicker from 'react-datepicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ForexIndexDailyScores() {
  const symbolArray = [
    'US10Y',
    'USO',
    'BTCUSD',
    'AUDCAD',
    'AUDCHF',
    'AUDJPY',
    'AUDNZD',
    'AUDUSD',
    'CADCHF',
    'CADJPY',
    'CHFJPY',
    'EURAUD',
    'EURCAD',
    'EURCHF',
    'EURGBP',
    'EURJPY',
    'EURNZD',
    'EURUSD',
    'GBPAUD',
    'GBPCAD',
    'GBPCHF',
    'GBPJPY',
    'GBPNZD',
    'GBPUSD',
    'NZDCAD',
    'NZDCHF',
    'NZDJPY',
    'NZDUSD',
    'USDCAD',
    'USDCHF',
    'USDJPY',
    'USDZAR',
    'GER30',
    'JPY225',
    'NAS100',
    'SPX500',
    'UK100',
    'US30',
    'XAUUSD'
  ];

  const Price = {
    type: 'line',
    xKey: 'day',
    yKey: 'Price',
    yName: 'Price',
    grouped: true
  };

  const Score = {
    type: 'bar',
    xKey: 'day',
    yKey: 'Score',
    yName: 'Score',
    color: 'red',
    grouped: true,
    label: {
      enabled: true,
      color: '#D1D4DC' // Specify the label color here
    }
  };

  const BAR_AND_LINE = [
    { ...Score, type: 'bar' },
    { ...Price, type: 'line' }
  ];

  const dateItems = [];
  const [escore, setEscore] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [symbol, setSymbol] = useState('AUDJPY');
  const [startDate, setStartDate] = useState(moment().subtract(30, 'days').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [dates, setDates] = useState([]);

  const formatDate = (dateString) => moment.utc(dateString).format('YYYY-MM-DD');

  useEffect(() => {
    getPscoreData();
  }, [symbol]);

  const getPscoreData = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('symbol', symbol);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/activity/getEscore_symbol`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        setEscore(res.data);
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
      const formattedDate = date.format('YYYY-MM-DD');
      dateItems.push(formattedDate);
    }
    setDates(dateItems);
    getPscoreData();
  }, [startDate, endDate]);

  useEffect(() => {
    if (escore) {
      setChartData(
        dates.map((item) => {
          return {
            day: item,
            Price: Number(escore.find((pscoreItem) => formatDate(pscoreItem['Date']) === item)?.['Price']),
            Score: Number(escore.find((pscoreItem) => formatDate(pscoreItem['Date']) === item)?.['Score'])
          };
        })
      );
    }
  }, [escore]);

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
              Forex & Index Daily Scores
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <DatePicker className="stockdatepicker" selected={startDate} onChange={(date) => setStartDate(date)} />
            <DatePicker className="stockdatepicker" selected={endDate} onChange={(date) => setEndDate(date)} />
          </div>
          <Box sx={{ marginLeft: '30px', marginRight: '30px' }}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label" style={{ background: '#1e222d' }}>
                  Symbol
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={symbol}
                  label="Age"
                  onChange={(e) => setSymbol(e.target.value)}
                  style={{ color: 'rgb(189, 189, 189)' }}
                >
                  {symbolArray.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
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
                  keys: ['Price'],
                  title: {
                    text: 'Price',
                    color: '#D1D4DC'
                  },
                  label: {
                    color: '#D1D4DC'
                  },
                  tick: {
                    values: 5
                  }
                },
                {
                  // secondary y axis
                  type: 'number',
                  position: 'right',
                  keys: ['Score'],
                  title: {
                    text: 'Score',
                    color: '#D1D4DC'
                  },
                  label: {
                    color: '#D1D4DC'
                  },
                  tick: {
                    values: 5
                  }
                }
              ]
            }}
          />
        </div>
      </div>
    </div>
  );
}
/* eslint-disable */

import React, { useCallback, useEffect, useState } from 'react';
import TradingViewChart from './TradingViewChart';
import './ChartTrendsMatrix.css';
import AllMonthTradingViewChart from './AllMonthTradingViewChart';
import { Link } from 'react-router-dom';
import logo from 'assets/images/icons/tbLogo.png';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import axios from 'axios';

const ChartTrendsMatrix = () => {
  const [brokerLoading, setBrokerLoading] = useState(false);
  const [symbolKeyword, setSymbolKeyword] = useState('AAPL');
  const [symbol, setSymbol] = useState('AAPL');
  const [refreshToken, setRefreshToken] = useState(0);

  const [allMonthChartData, setAllMonthChartData] = useState(null);
  const [charData, setChartData] = useState([]);

  const handleSubmit = useCallback(() => {
    if (symbol === symbolKeyword) setRefreshToken(new Date().getTime());
    else setSymbol(symbolKeyword);
  }, [symbolKeyword, symbol, setSymbol]);

  const keyPress = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        if (brokerLoading) return;

        handleSubmit();
      }
    },
    [brokerLoading, handleSubmit]
  );

  const loadBroker = useCallback(async () => {
    let bodyFormData = new FormData();
    bodyFormData.append('symbol', symbol);
    setBrokerLoading(true);
    return axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/activity/technicalguage`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        setBrokerLoading(false);
        if (res.status === 200 && res.data.message === 'success') {
          return res.data.data.broker;
        }
        throw new Error('NO_BROKER_FOUND');
      })
      .catch(() => setBrokerLoading(false));
  }, [symbol, setBrokerLoading]);

  const generateChartData = useCallback((symbol, broker) => {
    return [
      // Row 1 graphs

      {
        title: '5 Day 1 Hour',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|5D`,
        dateRange: '5d|60'
      },
      {
        title: '5 Day 4 Hour',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|5D`,
        dateRange: '5d|240'
      },
      {
        title: '1 Week 4 Hour',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|7D`,
        dateRange: '1w|240'
      },
      {
        title: '1 Month 4 Hour',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|1M`,
        dateRange: '1m|240'
      },
      {
        title: '3 Month 1 Week',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|3M`,
        dateRange: '3m|1W'
      },
      {
        title: '6 Month 1 Week',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|6M`,
        dateRange: '6m|1W'
      },
      {
        title: '1 Year 1 Month',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|12M`,
        dateRange: '12m|1M'
      },
      {
        title: '5 Year 3 Month',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|60M`,
        dateRange: '60m|3M'
      },

      //Row 2 Graphs

      {
        title: '5 Day 30 Minute',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|5D`,
        dateRange: '5d|30'
      },
      {
        title: '5 Day 1 Hour',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|5D`,
        dateRange: '5d|60'
      },
      {
        title: '1 Week 1 Hour',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|7D`,
        dateRange: '1w|60'
      },
      {
        title: '1 Month 1 Hour',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|1M`,
        dateRange: '1m|60'
      },
      {
        title: '3 Month 4 Hour',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|3M`,
        dateRange: '3m|240'
      },
      {
        title: '6 Month 1 Day',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|6M`,
        dateRange: '6m|1D'
      },
      {
        title: '1 Year 1 Week',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|12M`,
        dateRange: '12m|1W'
      },
      {
        title: '5 Year 1 Month',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|60M`,
        dateRange: '60m|1M'
      },

      //Row 3 Graphs

      {
        title: '5 Day 15 Minute',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|5D`,
        dateRange: '5d|15'
      },
      {
        title: '5 Day 30 Minute',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|5D`,
        dateRange: '5d|30'
      },
      {
        title: '1 Week 30 Minute',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|7D`,
        dateRange: '1w|30'
      },
      {
        title: '1 Month 30 Minute',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|1M`,
        dateRange: '1m|30'
      },
      {
        title: '3 Month 1 Hour',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|3M`,
        dateRange: '3m|60'
      },
      {
        title: '6 Month 4 Hour',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|6M`,
        dateRange: '6m|240'
      },
      {
        title: '1 Year 1 Day',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|12M`,
        dateRange: '12m|1D'
      },
      {
        title: '5 Year 1 Week',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}|60M`,
        dateRange: '60m|1W'
      }
    ];
  }, []);

  const loadChart = useCallback(async () => {
    try {
      const broker = await loadBroker();
      setChartData(generateChartData(symbol, broker));
      setAllMonthChartData({ symbol, broker, title: 'ALL 1 month', dateRange: 'all|1M' });
    } catch (ex) {
      console.log('an error occurred while loading the broker data.');
    }
  }, [symbol, loadBroker]);

  useEffect(() => {
    loadChart();
  }, [loadChart]);

  return (
    <>
      <div className="logo">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Link className="logo-img" to="/dashboard">
            <img src={logo} alt="logo" style={{ width: '100%' }}></img>
          </Link>
          <div className="logo-text">
            <div style={{ fontSize: '20px', color: 'rgb(189, 189, 189)', display: 'flex', alignItems: 'center' }}>Chart Trends Matrix</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', height: '40px', marginTop: '15px' }}>
          <Paper
            sx={{ p: '2px', display: 'flex', alignItems: 'center', width: 200 }}
            style={{ marginRight: '10px', background: '#2a2e39' }}
            value={symbolKeyword}
            onChange={(e) => {
              setSymbolKeyword(e.target.value.toUpperCase());
            }}
            onKeyDown={keyPress}
          >
            <IconButton type="button" sx={{ p: '10px' }} aria-label="Symbol">
              <SearchIcon style={{ color: '#d1d4dc' }} />
            </IconButton>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="AAPL" style={{ color: '#d1d4dc' }} />
          </Paper>
          <Button
            variant="contained"
            style={{ marginRight: '10px', background: '#2962ff' }}
            onClick={handleSubmit}
            disabled={brokerLoading}
          >
            Submit
          </Button>
        </div>
      </div>
      <div className="tradingview-widget-container" id="chart-container">
        {allMonthChartData ? (
          <div style={{ width: '100%' }}>
            <AllMonthTradingViewChart {...allMonthChartData} refreshToken={refreshToken} />
          </div>
        ) : (
          <></>
        )}

        {charData.map((config, index) => (
          <div className="chart-container" key={`trading-view-chart-${index}`}>
            <TradingViewChart {...config} refreshToken={refreshToken} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ChartTrendsMatrix;

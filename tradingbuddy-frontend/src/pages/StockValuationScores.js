/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import { Box, IconButton, Button, InputBase, Stack, ClickAwayListener } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from 'assets/images/icons/tbLogo.png';
import 'react-datepicker/dist/react-datepicker.css';
import './mt4tools/index.css';
import DatePicker from 'react-datepicker';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/system';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const PopupBody = styled('div')(
  () => `
  width: 290px;
  margin: 8px;
  margin-top: 25px;
  border-radius: 8px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
  color:#D1D4DC;
  background:#1e222d;
  border: 1px solid #D1D4DC;
  overflow: hidden;
`
);

export default function StockDailyScores() {
  const CLOSE = {
    type: 'line',
    xKey: 'day',
    yKey: 'Price',
    yName: 'Price'
  };

  const PSCORE = {
    type: 'bar',
    xKey: 'day',
    yKey: 'Score',
    yName: 'Score',
    color: 'red',
    label: {
      enabled: true,
      color: '#D1D4DC' // Specify the label color here
    }
  };

  const BAR_AND_LINE = [
    { ...PSCORE, type: 'bar' },
    { ...CLOSE, type: 'line' }
  ];

  const dateItems = [];
  const [stockValuation, setStockValuation] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [symbolTemp, setSymbolTemp] = useState('AAPL');
  const [startDate, setStartDate] = useState(moment().subtract(15, 'days').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [topUndervaluedScores, setTopUndervaluedScores] = useState([]);
  const [topOvervaluedScores, setTopOvervaluedScores] = useState([]);
  const [anchor, setAnchor] = useState(null);

  // const formatDate = (dateString) => moment.utc(dateString).format('YYYY-MM-DD');

  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const handleCloseClick = async () => {
    setAnchor(null);
  };

  const handlePopupClose = () => {
    if (opened) {
      setAnchor(null);
    }
  };

  const opened = Boolean(anchor);
  const id = opened ? 'simple-popup' : undefined;

  const getStockValuationScores = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('symbol', symbol);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/activity/getStockValuationScores_symbol`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        setStockValuation(res.data);
      })
      .catch((res) => {
        toast.error(res.message);
      });
  };

  useEffect(() => {
    const getTopUndervaluedScores = async () => {
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/activity/topUndervaluedScores`,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          if (res.status === 200) {
            setTopUndervaluedScores(res.data.data);
          }
        })
        .catch((res) => {
          toast.error(res.message);
        });
    };
    const getTopOvervaluedScores = async () => {
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/activity/topOvervaluedScores`,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          if (res.status === 200) {
            setTopOvervaluedScores(res.data.data);
          }
        })
        .catch((res) => {
          toast.error(res.message);
        });
    };
    getTopUndervaluedScores();
    getTopOvervaluedScores();
    getStockValuationScores();
  }, []);

  function getWeeksBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let weeks = [];

    for (let day = start; day <= end; day.setDate(day.getDate() + 7)) {
      // Get the date of the Thursday of the week.
      let thursday = new Date(day.getTime());

      // Adjust the date to get to Thursday
      thursday.setDate(thursday.getDate() + ((3 + 7 - thursday.getDay()) % 7));

      weeks.push(`${thursday.getFullYear()}-${thursday.getMonth() + 1}-${Math.ceil(thursday.getDate() / 7)} week`);
    }
    setDates(weeks);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-based.
    const weekNumber = Math.ceil((date.getDate() + 1 - (date.getDay() || 7)) / 7); // Calculate week number of the month
    return `${year}-${month}-${weekNumber} week`;
  };

  useEffect(() => {
    getWeeksBetween(startDate, endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    if (stockValuation.length > 0) {
      setChartData(
        dates.map((item) => {
          return {
            day: item,
            Price: Number(stockValuation.find((pscoreItem) => formatDate(pscoreItem[0]) === item)?.[4]),
            Score: Number(stockValuation.find((pscoreItem) => formatDate(pscoreItem[0]) === item)?.[2])
          };
        })
      );
    }
  }, [stockValuation, dates]);

  return (
    <>
      <style>
        {`
          .scrollbar::-webkit-scrollbar {
            width: 12px;
            border-radius: 20px;
          }
          .scrollbar::-webkit-scrollbar-track {
            background: #424242;
          }
          .scrollbar::-webkit-scrollbar-thumb {
            background-color: #888; 
            border-radius: 20px;
            border: 3px solid #424242;
          }
        `}
      </style>
      <div className="tradingview-widget-container" style={{ height: '100%' }}>
        <div className="tradingview-widget-container__widget" style={{ height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" style={{ height: '10%' }}>
            <div style={{ display: 'flex', height: '70px,', textAlign: 'center', paddingLeft: '20px', alignItems: 'center' }}>
              <img src={logo} alt="logo" style={{ width: '60px', height: '60px' }}></img>
              <div
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  display: 'flex',
                  fontSize: '20px',
                  color: 'rgb(189, 189, 189)'
                }}
              >
                Stock Valuation Scores
              </div>
              <ClickAwayListener onClickAway={handlePopupClose}>
                <Box>
                  <InfoIcon style={{ color: 'rgb(189, 189, 189)' }} onClick={handleClick} />
                  <BasePopup id={id} open={opened} anchor={anchor}>
                    <PopupBody>
                      <Box sx={{ padding: '12px 16px', overflow: 'auto', height: '450px' }} className="scrollbar">
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                          <ExitToAppIcon onClick={handleCloseClick} />
                        </Box>
                        <Box sx={{ fontWeight: 'bold' }}>INFORMATION</Box>
                        <Box>
                          The Score is based on a fundamental analysis score that assesses the financial health and overall performance of a
                          company. The score ranges from 0 to 100 and the higher the score the better a company is performing solid
                          fundamentally and its financial condition. A company of 80 or higher indicate above average financial condition
                          and overall strength. The % Under or Overvalued is calculated based on taking the average intrinsic value
                          estimates of P/E, DCF and ROE Valuations of a company to determine the estimated calculation of how much the
                          company is worth on a per share basis. This average is then compared to the recent close price. A close price
                          above the calculated intrinsic value estimate results in a company being deemed Overvalued. A close price below
                          the calculated intrinsic value estimate results in a company being deemed Undervalued. The tool list the top 15
                          highest scores that are calculated as Undervalued and the bottom 15 scores that are calculated as Overvalued. The
                          values and price over time are plotted for a given input ticker to show the changes and comparison between a
                          company’s score and its current price compared to its calculated intrinsic price estimate. Users can use this to
                          formulate trade ideas and strategies from over time.
                        </Box>
                      </Box>
                    </PopupBody>
                  </BasePopup>
                </Box>
              </ClickAwayListener>
            </div>
            <Box sx={{ color: 'pink', fontSize: '16px' }}>{symbolTemp.toUpperCase()}</Box>
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
                        getStockValuationScores();
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
                      getStockValuationScores();
                    }}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
          <Stack direction="row" sx={{ height: '90%' }}>
            <Box sx={{ width: '20%', height: '90%', display: 'flex' }}>
              <Stack direction="column" spacing={2} sx={{ width: '100%', padding: '20px' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: '50%',
                    border: '1px solid #434651',
                    color: '#bdbdbd',
                    borderRadius: '20px',
                    overflow: 'hidden'
                  }}
                >
                  <Stack className="scrollbar" direction="column" sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
                    <Box sx={{ color: 'red', padding: '10px', display: 'flex', justifyContent: 'center' }}>Top 15 Undervalued Scores</Box>
                    <Box sx={{ height: '100%' }}>
                      <Stack direction="row" justifyContent="center" spacing={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box>Symbol</Box>
                          {topUndervaluedScores.map((item, index) => (
                            <Box key={index}>
                              <Box sx={{ fontSize: '13px' }}>{item[0]}</Box>
                            </Box>
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box>Score</Box>
                          {topUndervaluedScores.map((item, index) => (
                            <Box key={index}>
                              <Box sx={{ fontSize: '13px' }}>{item[1]}</Box>
                            </Box>
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box>%</Box>
                          {topUndervaluedScores.map((item, index) => (
                            <Box key={index}>
                              <Box sx={{ fontSize: '13px' }}>{(item[2] * 100).toFixed(0)}%</Box>
                            </Box>
                          ))}
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: '50%',
                    border: '1px solid #434651',
                    color: '#bdbdbd',
                    borderRadius: '20px',
                    overflow: 'hidden'
                  }}
                >
                  <Stack className="scrollbar" direction="column" sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
                    <Box sx={{ color: 'green', padding: '10px', display: 'flex', justifyContent: 'center' }}>Top 15 Overvalued Scores</Box>
                    <Box sx={{ height: '100%' }}>
                      <Stack direction="row" justifyContent="center" spacing={5}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box>Symbol</Box>
                          {topOvervaluedScores.map((item, index) => (
                            <Box key={index}>
                              <Box sx={{ fontSize: '13px' }}>{item[0]}</Box>
                            </Box>
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box>Score</Box>
                          {topOvervaluedScores.map((item, index) => (
                            <Box key={index}>
                              <Box sx={{ fontSize: '13px' }}>{item[1]}</Box>
                            </Box>
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box>%</Box>
                          {topOvervaluedScores.map((item, index) => (
                            <Box key={index}>
                              <Box sx={{ fontSize: '13px' }}>{(item[2] * 100).toFixed(0)}%</Box>
                            </Box>
                          ))}
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Box>
            <div style={{ width: '80%' }}>
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
                      }
                    }
                  ]
                }}
              />
            </div>
          </Stack>
        </div>
      </div>
    </>
  );
}
/* eslint-disable */

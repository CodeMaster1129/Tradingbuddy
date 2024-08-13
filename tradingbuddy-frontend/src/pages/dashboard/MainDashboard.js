/* eslint-disable */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import './style/mainDashboardLayout.css';
import './style/styles.css';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import TradingViewMainChartWidget from './TradingViewMainChartWidget';
import TechnicalGuage from './TechnicalGuage';
import DashInsiderActivity from './DashInsiderActivity';
import DashSplitHistory from './DashSplitHistory';
import DashNews from './DashNews';
import DashAlerts from './DashAlerts';
import DashSignal from './DashSignal';
import DashEconomicCalendar from './DashEconomicCalendar';
import DashScreener from '../component-widget/Screeners';
import DashIrregularActivitys from './DashIrregularActivitys';
import DashTechnicalIndicator from './DashTechnicalIndicator';
import DashMovingAverage from './DashMovingAverage';
import DashLiveOptions from './DashLiveOptions';
import DailyPscores from './DailyPscores';
import { toast } from 'react-toastify';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import MaDisplay from 'pages/component-widget/MaDisplay';
import { Typography, Popper, Box, Button, IconButton, InputBase, Paper, Stack, TextField } from '@mui/material';
import DashKeyStats from './DashKeyStats';

const INITIAL_LAYOUTS = [
  { i: 'trading-view-main-chart', x: 3, y: 0, w: 4, h: 7 },
  { i: 'widget-1', x: 6, y: 17, w: 6, h: 11 },
  { i: 'widget-2', x: 1, y: 0, w: 2, h: 11 },
  { i: 'insider-activity', x: 9, y: 0, w: 3, h: 5 },
  { i: 'technical-indicator', x: 9, y: 28, w: 3, h: 16 },
  { i: 'split-history', x: 9, y: 5, w: 3, h: 3 },
  { i: 'moving-average', x: 6, y: 28, w: 3, h: 16 },
  { i: 'technical-guage', x: 3, y: 7, w: 4, h: 10 },
  { i: 'widget-8', x: 0, y: 0, w: 1, h: 28 },
  { i: 'economical-calendar', x: 9, y: 8, w: 3, h: 9 },
  { i: 'widget-10', x: 7, y: 0, w: 2, h: 10 },
  { i: 'news', x: 7, y: 10, w: 2, h: 7 },
  { i: 'widget-12', x: 3, y: 17, w: 3, h: 11 },
  { i: 'alerts', x: 1, y: 11, w: 2, h: 17 },
  { i: 'widget-14', x: 0, y: 28, w: 6, h: 16 }
];
const WIDGETS = INITIAL_LAYOUTS.map(({ i }) => i);

export default function MainDashboard(props) {
  const ResponsiveReactGridLayout = useMemo(() => WidthProvider(Responsive), []);

  const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
  const rowHeight = 30;
  const [layouts, setLayouts] = useState({
    lg: INITIAL_LAYOUTS
  });
  const [layoutLoaded, setLayoutLoaded] = useState(false);
  const [getEmailLoaded, setGetEmailLoaded] = useState(false);
  const [layoutsData, setLayoutsData] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  const [mounted, setMounted] = useState(false);
  const [compactType, setCompactType] = useState('vertical');
  const [data, setData] = useState([]);
  const [irregularData, setIrregularData] = useState([]);
  const [liveOptionsTableData, setLiveOptionTableData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [symbolAlt, setSymbolAlt] = useState('EURUSD');
  const [from, setFrom] = useState(0);
  const [isloading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [splitData, setSplitData] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const symbolRef = useRef();

  const handleClickIcon = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    setSymbol(symbolRef.current.children[0].value);
    setSymbolAlt(symbolRef.current.children[0].value);

    setSubmit(!submit);
    setLoading(true);
    setScoreLoading(true);
    await getInsiderData();
    await getLiveOptionsTableData();
    await getIrregularTableData();
    await getSplitData();
  };

  const keyPress = async (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  useEffect(() => {
    getInsiderData();
    getLiveOptionsTableData();
    getIrregularTableData();
    getSplitData();
  }, []);

  const getInsiderData = async () => {
    if (symbol) {
      try {
        let res = await axios.post(
          process.env.REACT_APP_API_ENDPOINT,
          {
            query: {
              query_string: {
                query: `issuer.tradingSymbol:${symbol}`
              }
            },
            from: from === 0 ? 0 : from * 30 + 1,
            sort: [{ filedAt: { order: 'desc' } }]
          },
          {
            headers: {
              'content-type': 'application/json',
              Authorization: process.env.REACT_APP_API_KEY
            }
          }
        );
        var resData = res.data.transactions;
        let showData = [];
        resData.map((item) => {
          let base = {
            periodOfReport: item.periodOfReport,
            issuerCik: item.issuer.cik,
            issuerTicker: item.issuer.tradingSymbol,
            reportingPerson: item.reportingOwner.name,
            officerTitle: item.reportingOwner.relationship.officerTitle ? item.reportingOwner.relationship.officerTitle : ''
          };
          if (item.nonDerivativeTable) {
            if (item.nonDerivativeTable.transactions)
              item.nonDerivativeTable.transactions.map((transaction) => {
                let entry = {
                  securityTitle: transaction.securityTitle,
                  codingCode: transaction.coding.code,
                  acquiredDisposed: transaction.amounts.acquiredDisposedCode,
                  shares: transaction.amounts.shares,
                  sharePrice: transaction.amounts.pricePerShare,
                  total: Math.ceil(transaction.amounts.shares * transaction.amounts.pricePerShare),
                  sharesOwnedFollowingTransaction: transaction.postTransactionAmounts.sharesOwnedFollowingTransaction,
                  base: base
                };

                showData.push(entry);
              });
          }
        });
        if (showData?.length) setData([...showData]);
        setFrom(from + 1);
      } catch (e) {
        console.log('error', e);
        toast.error(e);
      }
    }
  };

  const getSplitData = async () => {
    try {
      const response = await fetch(`https://eodhd.com/api/splits/${symbol}.US?fmt=json&from=2000-01-01&&api_token=653ab15bd64429.39680735`);
      const data = await response.json();
      setSplitData(data);
    } catch (error) {
      console.error('Error fetching splits data:', error);
    }
  };

  const getIrregularTableData = async () => {
    if (symbol) {
      try {
        const bodyFormData = new FormData();
        bodyFormData.append('symbol', symbol);

        let res = await axios({
          method: 'post',
          url: `${process.env.REACT_APP_API_URL}/activity/getirregularactivity_symbol`,
          data: bodyFormData,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.status === 200) {
          setIrregularData(res.data);
        }
      } catch (e) {
        toast.error(e);
      }
    }
  };

  const getLiveOptionsTableData = async () => {
    if (symbol) {
      try {
        const bodyFormData = new FormData();
        bodyFormData.append('symbol', symbol);

        let res = await axios({
          method: 'post',
          url: `${process.env.REACT_APP_API_URL}/activity/getLiveOptions_symbol`,
          data: bodyFormData,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.status === 200) {
          setLiveOptionTableData(res.data);
        }
      } catch (e) {
        toast.error(e);
      }
    }
  };

  const onLayoutChange = useCallback(
    (currentLayout, allLayouts) => {
      if (!layoutLoaded) return;
      setLayouts(allLayouts);
      localStorage.setItem('layouts', JSON.stringify(allLayouts));
    },
    [layoutLoaded]
  );

  useEffect(() => {
    try {
      const layouts = JSON.parse(localStorage.getItem('layouts'));
      if (layouts) {
        setLayouts(layouts);
      }
      setLayoutLoaded(true);
    } catch (ex) {}
  }, [setLayouts, setLayoutLoaded]);

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        setUserEmail(userData['email']);
      }
    } catch (ex) {}
    setGetEmailLoaded(true);
  }, []);

  useEffect(() => {
    if (getEmailLoaded) {
      async function fetchData() {
        var bodyFormData = new FormData();
        bodyFormData.append('email', userEmail);
        await axios({
          method: 'post',
          url: `${process.env.REACT_APP_API_URL}/activity/getlayouts`,
          data: bodyFormData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then((res) => {
            setLayoutsData(res.data.layouts);
          })
          .catch((err) => console.log(err));
      }
      fetchData();
      setGetEmailLoaded(true);
    }
  }, [getEmailLoaded]);

  const saveDahsboardLayout = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('email', userEmail);
    bodyFormData.append('layouts', JSON.stringify(layouts));
    bodyFormData.append('layoutname', inputValue);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/activity/savelayouts`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        if (res.status === 200) {
          setLayoutsData(res.data.data);
          toast.success(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLoadItem = (id) => {
    var selectedLayout = layoutsData.find((layout) => layout.id === id);

    setLayouts(JSON.parse(selectedLayout.layouts));
    toast.success(`${selectedLayout.layoutname} Layout Loaded!!!`);
  };
  const handleDeleteItem = async (id) => {
    var bodyFormData = new FormData();
    bodyFormData.append('id', id);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/activity/deletelayout`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Layout deleted');
          setLayoutsData(layoutsData.filter((layout) => layout.id !== id));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '10px' }}>
        <div>
          <h1 style={{ color: ' #d1d4dc' }}>Dashboard</h1>
        </div>
        <div style={{ width: '16.3%' }}></div>
        <div style={{ width: '50%' }}>
          <DailyPscores symbol={symbol} submit={submit} scoreLoading={scoreLoading} setScoreLoading={setScoreLoading} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: 'calc(35% - 150px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: '30px' }}>
            <SettingsIcon style={{ color: ' #d1d4dc', width: '30px', height: '30px' }} onClick={handleClickIcon} />
          </div>
          <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end" sx={{ border: '1px solid #D1D4DC ', borderRadius: '5px' }}>
            <Box
              sx={{
                p: 1,
                bgcolor: '#1e222d',
                width: '250px',
                height: '450px',
                borderRadius: '5px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)'
              }}
            >
              <Box
                sx={{
                  borderBottom: '1px solid #434651',
                  p: 1,
                  height: '10%',
                  color: '#434651',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Dashboard layouts
              </Box>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  height: '10%',
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  '&:hover': {
                    cursor: 'pointer'
                  }
                }}
                onClick={saveDahsboardLayout}
              >
                <AddIcon sx={{ color: '#D1D4DC' }} />
                <Typography sx={{ color: '#D1D4DC' }}>Save current layouts</Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  height: '10%',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #434651',
                  p: 1,
                  '&:hover': {
                    cursor: 'pointer'
                  }
                }}
              >
                <Typography sx={{ color: '#D1D4DC', paddingBottom: '10px' }}>New: </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    style: {
                      color: '#D1D4DC'
                    }
                  }}
                  onChange={handleChange}
                  sx={{ paddingBottom: '15px' }}
                />
              </Stack>
              <Box sx={{ borderBottom: '1px solid #434651', p: 1, height: '55%', overflow: 'auto' }}>
                <Typography
                  sx={{
                    color: '#D1D4DC',
                    '&:hover': {
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => handleLoadItem(1)}
                >
                  Default Layout
                </Typography>
                <Box sx={{ pt: 1, pb: 1 }}>
                  {layoutsData
                    .filter((layout) => layout.id !== 1)
                    .map((item, index) => (
                      <Stack key={index} direction="row" spacing={2} sx={{ height: '30px', display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ color: '#D1D4DC', width: '70%' }}>{item.layoutname}</Typography>
                        <Typography
                          sx={{
                            color: '#D1D4DC',
                            width: '15%',
                            '&:hover': {
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => handleLoadItem(item.id)}
                        >
                          Load
                        </Typography>
                        <DeleteForeverIcon
                          sx={{
                            color: '#D1D4DC',
                            width: '15%',
                            '&:hover': {
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => handleDeleteItem(item.id)}
                        ></DeleteForeverIcon>
                      </Stack>
                    ))}
                </Box>
              </Box>
              <Box sx={{ p: 1, height: '15%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <ExitToAppIcon
                  sx={{
                    color: '#D1D4DC',
                    '&:hover': {
                      cursor: 'pointer'
                    }
                  }}
                  onClick={handleClickIcon}
                />
              </Box>
            </Box>
          </Popper>
          <Paper
            sx={{ p: '2px', display: 'flex', alignItems: 'center', width: 200 }}
            style={{ marginRight: '10px', background: '#2a2e39', border: '1px solid gray' }}
            onKeyDown={keyPress}
          >
            <IconButton type="button" sx={{ p: '10px' }} aria-label="Symbol">
              <SearchIcon style={{ color: '#d1d4dc' }} />
            </IconButton>
            <InputBase ref={symbolRef} sx={{ ml: 1, flex: 1 }} placeholder="Symbol" style={{ color: '#d1d4dc', minWidth: 150 }} />
          </Paper>
          <Button variant="contained" style={{ marginRight: '10px', background: '#2962ff' }} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
      <ResponsiveReactGridLayout
        {...props}
        rowHeight={rowHeight}
        cols={cols}
        layouts={layouts}
        onLayoutChange={onLayoutChange}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        compactType={compactType}
        preventCollision={!compactType}
      >
        {WIDGETS.map((widget, i) => (
          <div key={widget} className="grid-item">
            <Widget
              i={i}
              widget={widget}
              props={{ symbol, symbolAlt, submit, data, splitData, isloading, irregularData, liveOptionsTableData, loading, setLoading }}
            />
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
}

const Widget = ({
  i,
  widget,
  props: { symbol, symbolAlt, submit, data, splitData, irregularData, liveOptionsTableData, isloading, loading, setLoading }
}) => {
  switch (widget) {
    case 'trading-view-main-chart':
      return <TradingViewMainChartWidget symbol={symbol} submit={submit} />;
    case 'insider-activity':
      return <DashInsiderActivity data={data} />;
    case 'technical-indicator':
      return <DashTechnicalIndicator symbol={symbolAlt} submit={submit} />;
    case 'split-history':
      return <DashSplitHistory data={splitData} isloading={isloading} />;
    case 'moving-average':
      return <DashMovingAverage symbol={symbolAlt} submit={submit} />;
    case 'technical-guage':
      return <TechnicalGuage symbol={symbol} submit={submit} />;
    case 'economical-calendar':
      return <DashEconomicCalendar />;
    case 'news':
      return <DashNews symbol={symbol} submit={submit} />;
    case 'alerts':
      return <DashAlerts symbol={symbol} submit={submit} />;
    case 'widget-14':
      return <DashScreener />;
    case 'widget-12':
      return <DashIrregularActivitys data={irregularData} />;
    case 'widget-1':
      return <DashLiveOptions data={liveOptionsTableData} />;
    case 'widget-8':
      return <MaDisplay symbol={symbol} submit={submit} loading={loading} setLoading={setLoading} />;
    case 'widget-10':
      return <DashKeyStats symbol={symbol} submit={submit} />;
    case 'widget-2':
      return <DashSignal />;
    default:
      return <>{`Widget ${i}`}</>;
  }
};

/* eslint-disable */

/* eslint-disable */
import './index.css';
import { useState, useEffect, useRef } from 'react';
import { EyeOutlined, TableOutlined, DownloadOutlined } from '@ant-design/icons';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import logo from 'assets/images/icons/tbLogo.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import { TimePicker } from 'antd';
import 'react-datepicker/dist/react-datepicker.css';
import CanvasJSReact from '@canvasjs/react-charts';

const MT4Tools = () => {
  const [onLoading, setOnLoading] = useState(true);
  const [sum, setSum] = useState(0);
  let startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  let endDate = new Date();
  const [timeRange, setTimeRange] = useState([dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')]);
  const [filter, setFilter] = useState({
    ACCOUNT: '',
    DATA: '',
    LEGS: '',
    SYMBOL: '',
    TYPE: '',
    OPEN_DATE: startDate,
    CLOSED_DATE: endDate,
    TIME_RANGE: ['00:00:00', '23:59:59']
  });
  const [combo, setCombo] = useState({ ACCOUNT: [], DATA: [], LEGS: [], SYMBOL: [], TYPE: [] });
  const tabRef = useRef();
  const overviewRef = useRef();

  const getTimeFromDateString = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const formattedTime = `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
    return formattedTime;
  };

  const addLeadingZero = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  //  Widget 1
  const symbols = {
    AUDCAD: 0,
    AUDCHF: 0,
    AUDJPY: 0,
    AUDNZD: 0,
    AUDUSD: 0,
    CADCHF: 0,
    CADJPY: 0,
    CHFJPY: 0,
    EURAUD: 0,
    EURCAD: 0,
    EURGBP: 0,
    EURJPY: 0,
    EURNZD: 0,
    EURUSD: 0,
    GBPAUD: 0,
    GBPCAD: 0,
    GBPCHF: 0,
    GBPJPY: 0,
    GBPNZD: 0,
    GBPUSD: 0,
    NZDCAD: 0,
    NZDCHF: 0,
    NZDJPY: 0,
    NZDUSD: 0,
    USDCAD: 0,
    USDCHF: 0,
    USDJPY: 0
  };
  const [elementsSL, setElementsSL] = useState([]);
  const [lastTime, setLastTime] = useState('');

  //  Widget 2
  const [elementsSP, setElementsSP] = useState([]);
  const [profit, setProfit] = useState(0);

  //  Widget 3
  const [elementsChart, setElementsChart] = useState([]);
  let CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const Chart = () => {
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      theme: 'dark2', // "light1", "dark1", "dark2"
      height: '250',
      axisX: {
        gridThickness: 1,
        interval: 2,
        intervalType: 'day',
        valueFormatString: 'YY.MM.DD',
        labelAngle: 90
      },

      data: [
        {
          type: 'line',
          toolTipContent: 'Total Legs: ({x}): {y}',
          indexLabel: '{z}', // Show y value
          indexLabelPlacement: 'auto',
          dataPoints: elementsChart
        }
      ]
    };
    return (
      <div>
        <CanvasJSChart options={options} />
      </div>
    );
  };

  // Widget 4
  const [widget4Data, setWidget4Data] = useState([]);

  // Widget 5
  const [widget5Data, setWidget5Data] = useState([]);

  // Widget 6
  const [widget6Data, setWidget6Data] = useState([]);

  // Widget 7
  const [widget7Data, setWidget7Data] = useState([]);

  // Widget 8
  const [widget8Data, setWidget8Data] = useState([]);

  //  Widget 9
  const [overview, setOverview] = useState([]);

  //  Widget 10
  const summary_items = ['SUMMARY', 'DETAIL'];
  const update_string = 'Data Last Updated: ';
  const [item, setItem] = useState(summary_items[0]);
  const handleChangeSummary = (event) => {
    setItem(event.target.value);
  };

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/mttools/gettime`,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        const date = new Date(res.data.timedata);
        const estTime = date.toLocaleString('en-US', { timeZone: 'America/New_York' });
        setLastTime(estTime);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/mttools/index`,
      data: '',
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        let temp = res.data['COMBO'];
        let SLData = res.data['SL'];
        let sum = SLData.reduce((total, item) => total + item[2], 0);
        setSum(sum);
        setCombo(temp);

        setFilter((pre) => {
          return {
            ...pre,
            DATA: temp['DATA'][0],
            ACCOUNT: temp['ACCOUNT'][0],
            LEGS: temp['LEGS'][0],
            SYMBOL: temp['SYMBOL'][0],
            TYPE: temp['TYPE'][0]
          };
        });

        //  Widget 1
        let SL_items = res.data.SL;
        for (let SL_item in SL_items) {
          let key = Object.values(SL_items)[SL_item][1].toUpperCase();
          let val = Object.values(SL_items)[SL_item][4];
          symbols[key] = val;
        }
        let element = [];
        for (let i = 0; i < Object.keys(symbols).length / 2; i++) {
          let i_2 = parseInt(Object.keys(symbols).length / 2) + 1 + i;
          element.push(
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '2px',
                backgroundColor: i % 2 == 0 ? 'RGBa(255,255,255,0.1)' : ''
              }}
            >
              <div style={{ width: '40%', display: 'flex', justifyContent: 'space-between' }}>
                <div>{Object.keys(symbols)[i]}</div> {Object.values(symbols)[i] !== 0 ? <div>{Object.values(symbols)[i]}</div> : null}
              </div>
              <div style={{ width: '40%', display: 'flex', justifyContent: 'space-between' }}>
                <div>{Object.keys(symbols)[i_2]}</div> {Object.values(symbols)[i_2] !== 0 ? <div>{Object.values(symbols)[i_2]}</div> : null}
              </div>
            </div>
          );
        }
        setElementsSL(element);
      })
      .catch((err) => {
        console.log(err);
      });
    if (onLoading) return;
    overviewRef.current.width = tabRef.current.scrollWidth;
  }, []);

  const handleChange = (key, value) => {
    if (key === 'TIME_RANGE') {
      let temp = value;
      let st = getTimeFromDateString(temp[0]);
      let end = getTimeFromDateString(temp[1]);
      setFilter({
        ...filter,
        [key]: [st, end]
      });
      setTimeRange(value);
    } else {
      const temp = {
        ...filter,
        [key]: value
      };
      setFilter(temp);
    }
    setOnLoading(true);
  };

  useEffect(() => {
    if (filter['ACCOUNT'] !== '') {
      const formData = new FormData();
      formData.append('filter', JSON.stringify(filter));
      axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/mttools/main`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          //  Widget 2
          let SP_items = res.data.SP;
          let element = [];
          let i = 0;
          let temp_profit = 0;
          for (let SP_item in SP_items) {
            let symbol = Object.values(SP_items)[SP_item][0];
            let price = Object.values(SP_items)[SP_item][1];
            temp_profit += parseFloat(price);
            element.push(
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0px 10px',
                  backgroundColor: i % 2 == 0 ? 'RGBa(255,255,255,0.1)' : ''
                }}
              >
                <div>{symbol.toUpperCase()}</div>
                <div style={{ color: price > 0 ? 'green' : 'red' }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}
                </div>
              </div>
            );
            i += 1;
          }
          setElementsSP(element);
          setProfit(temp_profit);

          //  Widget 3
          let chart_info = res.data.ChartRES;
          let chart_temp = [];
          for (let Chart_item in chart_info) {
            let key = Object.values(chart_info)[Chart_item][0];
            let val = Object.values(chart_info)[Chart_item][1];
            let type = Object.values(chart_info)[Chart_item][2].slice(0, 1).toLowerCase();
            let xItem = val + type;
            chart_temp.push({ x: new Date(key), y: val, z: type });
          }
          setElementsChart(chart_temp);

          //  Widget 9
          let overview_temp = res.data.overview;
          element = [];
          for (let i = 0; i < Object.keys(overview_temp).length; i++) {
            let key = Object.keys(overview_temp)[i];
            let val = Object.values(overview_temp)[i];
            element.push(
              <div className="overview_item" key={i}>
                <div>{key}</div>
                <div className="overview_val">{val}</div>
              </div>
            );
          }
          setOverview(element);

          setOnLoading(false);
        })
        .catch(() => {
          setOnLoading(false);
        });
    }
  }, [filter]);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/mttools/getwidget4data`,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        //Widget 4
        let widget4Data = res.data.widget4;
        let element4 = [];
        let i = 0;
        for (let item in widget4Data) {
          let name = Object.values(widget4Data)[item][1];
          let value = Object.values(widget4Data)[item][2];
          element4.push(
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0px 10px',
                backgroundColor: i % 2 == 0 ? 'RGBa(255,255,255,0.1)' : ''
              }}
            >
              <div className="divClass">{name}</div>
              <div style={{ color: '#d1d4dc', fontSize: '12px' }}>{value}</div>
            </div>
          );
          i += 1;
        }

        setWidget4Data(element4);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, []);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/mttools/getwidget5data`,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        //Widget 5
        let widget5Data = res.data.widget5;
        let element5 = [];
        let i = 0;

        for (let item in widget5Data) {
          let name = Object.values(widget5Data)[item][1];
          let value = Object.values(widget5Data)[item][2];
          element5.push(
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0px 10px',
                backgroundColor: i % 2 == 0 ? 'RGBa(255,255,255,0.1)' : ''
              }}
            >
              <div className="divClass">{name}</div>
              <div style={{ color: '#d1d4dc', fontSize: '12px' }}>{value}</div>
            </div>
          );
          i += 1;
        }

        setWidget5Data(element5);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, []);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/mttools/getwidget6data`,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        //Widget 6
        let widget6Data = res.data.widget6;
        let element6 = [];
        let i = 0;

        for (let item in widget6Data) {
          let name = Object.values(widget6Data)[item][1];
          let value = Object.values(widget6Data)[item][2];
          element6.push(
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0px 10px',
                backgroundColor: i % 2 == 0 ? 'RGBa(255,255,255,0.1)' : ''
              }}
            >
              <div className="divClass">{name}</div>
              <div style={{ color: '#d1d4dc', fontSize: '12px' }}>{value}</div>
            </div>
          );
          i += 1;
        }

        setWidget6Data(element6);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/mttools/getwidget7data`)
      .then((res) => {
        //Widget 7
        let widget7Data = res.data.widget7;
        let element7 = [];
        let i = 0;

        for (let item in widget7Data) {
          let name = Object.values(widget7Data)[item][1];
          let value = Object.values(widget7Data)[item][2];
          element7.push(
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0px 10px',
                backgroundColor: i % 2 == 0 ? 'RGBa(255,255,255,0.1)' : ''
              }}
            >
              <div className="divClass">{name}</div>
              <div style={{ color: '#d1d4dc', fontSize: '12px' }}>{value}</div>
            </div>
          );
          i += 1;
        }
        setWidget7Data(element7);
      })
      .catch((error) => {
        console.log('error', error);
        setOnLoading(false);
      });
  }, []);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/mttools/getwidget8data`,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        //Widget 8
        let widget8Data = res.data.widget8;
        let element8 = [];
        let i = 0;

        for (let item in widget8Data) {
          let name = Object.values(widget8Data)[item][1];
          let value = Object.values(widget8Data)[item][2];
          element8.push(
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0px 10px',
                backgroundColor: i % 2 == 0 ? 'RGBa(255,255,255,0.1)' : ''
              }}
            >
              <div className="divClass"> {name}</div>
              <div style={{ color: '#d1d4dc', fontSize: '12px' }}>{value}</div>
            </div>
          );
          i += 1;
        }
        setWidget8Data(element8);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, []);

  return (
    <>
      <div className="main">
        {!onLoading ? (
          <div className="left-side">
            <div className="logo">
              <Link className="logo-img" to="/dashboard">
                <img src={logo} alt="logo" style={{ width: '100%' }}></img>
              </Link>
              <div className="logo-text">
                <div style={{ fontSize: '20px', color: 'rgb(189, 189, 189)' }}>Trading Buddy</div>
                <div style={{ color: 'rgb(189, 189, 189)' }}>Fx MT DCA</div>
              </div>
            </div>
            <div className="open-trades">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                OPEN TRADES {sum}
                <EyeOutlined />{' '}
              </div>
              <div style={{ padding: '10px 0px' }}>SYMBOL / LEGS</div>
              <div style={{ fontSize: '12px', justifyContent: 'space-between' }}>{elementsSL}</div>
            </div>
            <div className="total-profit">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgb(189, 189, 189)' }}>
                Total Profit
                <EyeOutlined />
              </div>
              <div style={{ padding: '5px', justifyContent: 'space-between', display: 'flex' }}>
                <div style={{ color: 'rgb(189, 189, 189)' }}>SYMBOL</div>
                <div style={{ color: 'rgb(189, 189, 189)' }}>PROFIT</div>
              </div>
              <div className="profitContainer">{elementsSP}</div>
              <div style={{ padding: '5px', justifyContent: 'space-between', display: 'flex', fontSize: '15px' }}>
                <div style={{ paddingLeft: '5px', color: 'rgb(189, 189, 189)' }}>TOTAL</div>
                <div>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(profit.toFixed(2))}</div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="data-info">
          <div className="summary">
            <div>
              <FormControl sx={{ minWidth: 140 }}>
                <Select
                  value={item}
                  onChange={handleChangeSummary}
                  sx={{
                    '& .MuiSelect-icon': { color: '#bdbdbd' },
                    color: '#bdbdbd'
                  }}
                >
                  {summary_items.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div style={{ fontSize: '25px', cursor: 'pointer', color: '#bdbdbd' }}>
              <TableOutlined />
            </div>
            <div style={{ color: 'rgb(189, 189, 189)' }}>
              {update_string} {lastTime}
            </div>
          </div>
          {onLoading ? (
            <Backdrop sx={{ color: '#fff', zIndex: 999 }} open={true}>
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <div>
              <div className="graph">
                <Chart />
              </div>
              <div className="tab">
                <div className="tab-container" ref={tabRef}>
                  <div className="combo-group">
                    {Object.entries(combo).map(([key, value]) => (
                      <div key={key} style={{ width: '100%' }}>
                        <div style={{ padding: '5px' }}>{key}</div>
                        <FormControl sx={{ minWidth: '100%', color: 'white', fontSize: '30px' }}>
                          <Select
                            value={filter[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            sx={{ '& .MuiSelect-icon': { color: '#bdbdbd' }, color: '#bdbdbd', height: '30px' }}
                          >
                            {value.map((item, index) => (
                              <MenuItem value={item} key={index}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    ))}
                    <div style={{ minWidth: '120px', color: '#bdbdbd' }}>
                      <div style={{ padding: '5px', color: 'rgb(189, 189, 189)' }}>OPEN DATE</div>
                      <DatePicker
                        className="datepicker"
                        selected={filter['OPEN_DATE']}
                        onChange={(date) => handleChange('OPEN_DATE', date)}
                      />
                    </div>
                    <div style={{ minWidth: '120px' }}>
                      <div style={{ padding: '5px', color: 'rgb(189, 189, 189)' }}>CLOSED DATE</div>
                      <DatePicker
                        className="datepicker"
                        selected={filter['CLOSED_DATE']}
                        onChange={(date) => handleChange('CLOSED_DATE', date)}
                      />
                    </div>
                    <div style={{ minWidth: '200px' }}>
                      <div style={{ padding: '5px', color: 'rgb(189, 189, 189)' }}>OPEN TIME</div>
                      <TimePicker.RangePicker
                        className="timepicker"
                        onChange={(e) => handleChange('TIME_RANGE', e)}
                        showNow={false}
                        value={timeRange}
                      />
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '30px',
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'right',
                        alignItems: 'end',
                        cursor: 'pointer',
                        color: '#bdbdbd'
                      }}
                    >
                      <DownloadOutlined />
                    </div>
                  </div>
                  <div className="overview" ref={overviewRef}>
                    {overview}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    <div className="widget4">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgb(189, 189, 189)' }}>
                        Summary
                        <EyeOutlined />
                      </div>

                      <div className="widgetContainer">{widget4Data}</div>
                    </div>
                    <div className="widget5">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgb(189, 189, 189)' }}>
                        Multi Leg Summary
                        <EyeOutlined />
                      </div>
                      <div className="widgetContainer">{widget5Data}</div>
                    </div>
                    <div className="widget6">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgb(189, 189, 189)' }}>
                        Single Leg Summary
                        <EyeOutlined />
                      </div>

                      <div className="widgetContainer">{widget6Data}</div>
                    </div>
                    <div className="widget7">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgb(189, 189, 189)' }}>
                        Combined Summary
                        <EyeOutlined />
                      </div>

                      <div className="widgetContainer">{widget7Data}</div>
                    </div>
                    <div className="widget8">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgb(189, 189, 189)' }}>
                        Long & Short Summary
                        <EyeOutlined />
                      </div>
                      <div className="widgetContainer">{widget8Data}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default MT4Tools;

/* eslint-disable */

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import axios from 'axios';

function MaDisplay(props) {
  const { symbol, submit, loading, setLoading } = props;
  const [interval, setMyInterval] = useState('30min');
  const [tech, setTech] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const num = new Array(
    5,
    10,
    15,
    20,
    25,
    30,
    35,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80,
    85,
    90,
    95,
    100,
    120,
    130,
    140,
    150,
    160,
    170,
    180,
    190,
    200,
    210,
    220
  );

  const [timerHelper, setTimerHelper] = useState(0);
  const [priceTimer, setPriceTimer] = useState(0);

  const getMA_Data = async () => {
    let MA_Array = [];
    await axios({
      method: 'get',
      url: `https://alpha-vantage.p.rapidapi.com/query?time_period=5&interval=${interval}&series_type=close&function=SMA&symbol=${symbol}&datatype=json`,
      headers: {
        'X-RapidAPI-Key': '3baec9b921msheafb2be63df637dp14de7fjsn734590876b10',
        'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
      }
    })
      .then((res) => {
        const data = res.data['Technical Analysis: SMA'];
        let temp = [];
        let length = Object.entries(data).length;
        for (let item in data) {
          temp.push(Number(data[item].SMA));
        }
        if (length < 220) {
          for (let item in data) {
            temp.push(Number(data[item].SMA));
          }
          for (let i = legnth; i < 220; i++) {
            temp.push(0);
          }
        } else {
          for (let item in data) {
            temp.push(Number(data[item].SMA));
          }
        }
        for (let i = 0; i < num.length; i++) {
          let sum = 0;
          for (let j = 0; j < num[i]; j++) {
            sum += temp[j];
          }
          MA_Array.push(sum / num[i]);
        }
      })
      .catch((e) => {
        toast.error(e);
      });
    setTech(MA_Array);
    setLoading(false);
  };

  const getCurrentPrice = async () => {
    await axios({
      method: 'get',
      url: `https://alpha-vantage.p.rapidapi.com/query?interval=1min&function=TIME_SERIES_INTRADAY&symbol=${symbol}&datatype=json&output_size=compact`,
      headers: {
        'X-RapidAPI-Key': '3baec9b921msheafb2be63df637dp14de7fjsn734590876b10',
        'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
      }
    })
      .then((res) => {
        if (res.data) {
          let temp_series = [];
          let temp_fx = [];
          const data = res.data['Time Series (1min)'];
          for (let item in data) temp_series.push(Number(data[item]['4. close']));
          axios({
            method: 'get',
            url: `https://alpha-vantage.p.rapidapi.com/query?interval=1min&function=FX_INTRADAY&to_symbol=USD&from_symbol=AUD&datatype=json&output_size=compact`,
            headers: {
              'X-RapidAPI-Key': '3baec9b921msheafb2be63df637dp14de7fjsn734590876b10',
              'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
            }
          })
            .then((res) => {
              const data_forex = res.data['Time Series FX (1min)'];
              for (let item in data_forex) temp_fx.push(Number(data_forex[item]['4. close']));
              setCurrentPrice(temp_series[0] - temp_fx[0]);
            })
            .catch((e) => toast.error(e));
        }
      })
      .catch((e) => toast.error(e));
  };

  useEffect(() => {
    getMA_Data();
  }, [interval, submit, symbol, timerHelper]);

  useEffect(() => {
    getCurrentPrice();
  }, [submit, symbol, priceTimer]);

  useEffect(() => {
    window._timerid = setInterval(() => {
      setTimerHelper(Math.random());
    }, parseInt(interval.replace(/\D/g, '')) * 1000);

    return () => {
      clearTimeout(window._timerid);
    };
  }, []);

  useEffect(() => {
    window._price_timer = setInterval(() => {
      setPriceTimer(Math.random());
    }, 60000);

    return () => {
      clearTimeout(window._price_timer);
    };
  }, []);

  return (
    <>
      <style>
        {`
      .scrollbar::-webkit-scrollbar {
        width: 12px;
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
      {loading ? (
        <CircularProgress style={{ position: 'absolute', top: 200, left: '35%' }} />
      ) : (
        <div
          className="scrollbar"
          style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', overflow: 'auto', height: '100%', position: 'relative' }}
        >
          <span style={{ fontSize: '14px', marginLeft: '5px' }}>MAs</span>
          <FormControl style={{ width: '100%' }}>
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
              <MenuItem value="1min">1 minute</MenuItem>
              <MenuItem value="5min">5 minutes</MenuItem>
              <MenuItem value="10min">10 minutes</MenuItem>
              <MenuItem value="30min">30 minutes</MenuItem>
              <MenuItem value="60min">1 hour</MenuItem>
              <MenuItem value="daily">daily</MenuItem>
              <MenuItem value="weekly">weekly</MenuItem>
              <MenuItem value="monthly">monthly</MenuItem>
            </Select>
          </FormControl>
          <div
            style={{
              width: '100%',
              border: '1px solid gray',
              padding: '5px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '3%'
            }}
          >
            <div>Current Price</div>
            <div>${parseFloat(currentPrice).toFixed(2)}</div>
          </div>
          {num.map((value, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                borderLeft: '1px solid gray',
                borderRight: '1px solid gray',
                borderBottom: '1px solid gray',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ width: '35%', padding: '5px', borderRight: '1px solid gray' }}>
                <span>{value}</span>
              </div>
              <div
                style={{
                  width: '65%',
                  padding: '5px',
                  textAlign: 'right',
                  backgroundColor: tech[index] > currentPrice ? '#9F1818' : 'green'
                }}
              >
                <span>{parseFloat(tech[index]).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default MaDisplay;

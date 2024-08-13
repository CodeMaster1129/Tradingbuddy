/* eslint-disable*/
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { Grid, Typography } from '@mui/material';

import MainCard from 'components/MainCard';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import ChartComponent from 'utils/tradingView';
import { useTheme } from '@mui/material/styles';
import { Divider, Input } from '../../../node_modules/@mui/material/index';
import { CircularProgress } from '@mui/material';
import outputImg from 'assets/images/trading/output.png';
import afterImg from 'assets/images/trading/after.png';
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const symbol_items = [
    'SELECT',
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
    'USDJPY'
  ];
  const [loading, setloading] = useState(false);
  const [item, setItem] = useState(symbol_items[0]);
  const [time, setTime] = useState('');
  const handleChangeSymbol = async (event) => {
    const seletecd_symbol = event.target.value;
    setItem(seletecd_symbol);
    if (seletecd_symbol !== 'SELECT') {
      const timeZone = 'America/New_York'; // Eastern Time Zone (EDT)
      const currentTime = new Date();
      const options = {
        timeZone,
        weekday: 'short',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };

      const formatter = new Intl.DateTimeFormat('en-US', options);
      const formattedTime = formatter.format(currentTime);
      const weekday = formattedTime.split(',')[0];
      const date = formattedTime.split(',')[1].replace(/[/]/g, '-');
      const time = formattedTime.split(',')[2];
      let hour = time.split(' ')[1].split(':')[0];

      if (time.split(' ')[2] === 'PM') {
        hour = Number(hour) + 12;
      }
      const min = time.split(' ')[1].split(':')[1];
      const name = seletecd_symbol + '-' + weekday + '-' + date + '-' + hour + '-' + min;
      setTime(name);
      setInputImgName(name);
      const formData = new FormData();
      formData.append('symbol', seletecd_symbol);
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/render/${seletecd_symbol}`
      });
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/match/getChart`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          if (res.status === 200) {
            const res_img = 'data:image/jpeg;base64,' + res.data;
            inputImgRef.current.src = res_img;
            setInputImg(res_img);
            setSelectImg(true);
          }
        })
        .catch((err) => {
          toast.error('Server Error');
        });
    } else {
      setTime('');
    }
  };
  const [inputImg, setInputImg] = useState(require('assets/images/trading/input.png'));
  const [selectImg, setSelectImg] = useState(false);
  const [inputImgName, setInputImgName] = useState('AUDUSD-Mon-05-24-2023-11-4');
  const [outputImgName, setOutputImgName] = useState('AUDUSD-Mon-05-22-2023-16-00');
  const [afterImgName, setAfterImgName] = useState('AUDUSD-Thu-05-25-2023-23-30');
  const [accuracy, setAccuracy] = useState('85');
  const theme = useTheme();
  const outputImgRef = useRef(null);
  const inputImgRef = useRef(null);
  const afterImgRef = useRef(null);
  const fileInput = React.useRef();
  // let outputImg = require('assets/images/trading/output.png');
  // let afterImg = require('assets/images/trading/after.png');
  const Upload_Local = async (e) => {
    if (e.target.files[0]) {
      setInputImgName(e.target.files[0].name.slice(0, -4));
      let temp_url = await getBase64(e.target.files[0]);
      setInputImg(temp_url);
      setSelectImg(true);
    }
  };
  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = '';
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const Match = async () => {
    if (selectImg === true) {
      const formData = new FormData();
      formData.append('inputImg', inputImg);

      setloading(true);
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/match`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000
      })
        .then((res) => {
          if (res.status === 200) {
            setloading(false);
            const data = res.data;
            setAccuracy(data.accuracy);
            setOutputImgName(data.fname.slice(0, -4));
            setAfterImgName(data.after_name.slice(0, -4));
            console.log('data:image/jpeg;base64,' + data.img.slice(2, -1));
            console.log('data:image/jpeg;base64,' + data.after_img.slice(2, -1));
            // console.log(document.getElementById('outputImg'));
            if (outputImgRef.current) {
              outputImgRef.current.src = 'data:image/jpeg;base64,' + data.img.slice(2, -1);
            }
            if (afterImgRef.current) {
              afterImgRef.current.src = 'data:image/jpeg;base64,' + data.after_img.slice(2, -1);
            }
            // document.getElementById('outputImg').src = 'data:image/jpeg;base64,' + data.img.slice(2, -1);
            // document.getElementById('afterImg').src = 'data:image/jpeg;base64,' + data.after_img.slice(2, -1);
          }
        })
        .catch((err) => {
          toast.error('Server Error');
          console.log(err);
        });
    } else {
      toast.error('Please select original image');
    }
  };

  return (
    <div
      style={{
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        paddingTop: '30px'
      }}
    >
      <Grid sx={{ minWidth: 'fit-content', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
        <Grid container columnSpacing={2.75} padding="20px" xs={12} md={5.5} lg={11}>
          <ImageSearchIcon
            sx={{
              height: theme.palette.success.ImageSearchIcon,
              width: theme.palette.success.ImageSearchIcon,
              bgcolor: '#ffffff',
              borderRadius: '15px'
            }}
          />
          <Grid item>
            <Typography variant="h3" color="white">
              Fx Image Matching
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <PermMediaIcon
            sx={{
              height: '40px',
              width: '40px',
              bgcolor: 'white',
              borderRadius: '2px',
              cursor: 'pointer',
              padding: '5px'
            }}
            onClick={() => fileInput.current.click()}
          />
        </Grid>
      </Grid>

      <Grid container sx={{ minWidth: 'fit-content' }} display="flex" flexDirection="row" gap="30px">
        <Grid xs={12} md={7} lg={4}>
          <Typography variant="h4" color="#aabbc6">
            Input
          </Typography>
          <MainCard
            content={false}
            sx={{ mt: 1.5, bgcolor: 'transparent' }}
            style={{ display: 'flex', flexDirection: 'column', height: '485px', padding: '30px', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
              <FormControl sx={{ minWidth: 140 }}>
                <Select
                  value={item}
                  onChange={handleChangeSymbol}
                  sx={{
                    '& .MuiSelect-icon': { color: '#bdbdbd' },
                    color: '#bdbdbd'
                  }}
                >
                  {symbol_items.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid grey',
                  borderRadius: '5px',
                  display: 'flex',
                  paddingLeft: '20px',
                  alignItems: 'center',
                  color: 'rgba(255,255,255, 0.7)'
                }}
              >
                {time}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              {item != 'SELECT' ? (
                <ChartComponent symbol={item} />
              ) : (
                <div
                  style={{
                    width: '300px',
                    height: '200px',
                    border: '1px solid rgba(255, 255, 255, 0.7)',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '25px'
                  }}
                >
                  Select Symbol
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '50px' }}>
              <div
                style={{
                  width: '120px',
                  height: '60px',
                  backgroundColor: 'rgb(41, 95, 255)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  borderRadius: '5px'
                }}
                onClick={Match}
              >
                Submit
              </div>
            </div>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={7} lg={7}>
          <Typography variant="h4" color="#aabbc6">
            Matching Results
          </Typography>

          <MainCard content={false} sx={{ mt: 1.5, bgcolor: 'transparent', minWidth: 'fit-content' }}>
            <div
              style={{
                width: '100%',
                height: '485px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                gap: '20px'
              }}
            >
              {loading ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'white', fontSize: '30px' }}>Processing...</span>
                    <CircularProgress />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ width: '100%', height: '50%', display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '40px', height: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                      <Typography variant="h5" color="#aabbc6" sx={{ writingMode: 'vertical-lr', transform: 'rotate(-180deg)' }}>
                        Original
                      </Typography>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        gap: '40px'
                      }}
                    >
                      <div style={{ height: '100%', width: '50%', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" color="#aabbc6">
                          {inputImgName}
                        </Typography>
                        <img src={inputImg} width="100%" height="100%" ref={inputImgRef}></img>
                      </div>
                      <div
                        style={{
                          height: '100%',
                          width: '50%',
                          justifyContent: 'center',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography variant="h5" color="#aabbc6" sx={{ textAlign: 'center', paddingBottom: '20px' }}>
                          Confidence <br /> Level
                        </Typography>
                        <Divider sx={{ width: '40%', marginLeft: '30%' }}></Divider>
                        <Typography
                          variant="h1"
                          color="#22b14c"
                          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                        >
                          {accuracy}%
                        </Typography>
                        <Divider sx={{ width: '40%', marginLeft: '30%' }}></Divider>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '50%', display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '40px', height: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                      <Typography variant="h5" color="#aabbc6" sx={{ writingMode: 'vertical-lr', transform: 'rotate(-180deg)' }}>
                        Closest Match
                      </Typography>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        gap: '40px'
                      }}
                    >
                      <div style={{ height: '100%', width: '50%', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" color="#aabbc6">
                          {outputImgName}
                        </Typography>
                        <img src={outputImg} width="100%" height="100%" id="outputImg" ref={outputImgRef} />
                      </div>
                      <div style={{ height: '100%', width: '50%', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h5" color="#aabbc6">
                          {afterImgName}
                        </Typography>
                        <img src={afterImg} width="100%" height="100%" id="afterImg" ref={afterImgRef} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </MainCard>
        </Grid>
      </Grid>
      <input ref={fileInput} type="file" onChange={Upload_Local} style={{ display: 'none' }} />
    </div>
  );
};

export default DashboardDefault;

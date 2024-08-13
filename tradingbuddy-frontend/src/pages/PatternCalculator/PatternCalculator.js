/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CalculateIcon from '@mui/icons-material/Calculate';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import './PatternCalculator.css';

let tvScriptLoadingPromise;

const PatternCalculator = () => {
  const [shortBaseline, setShortBaseline] = useState(0);
  const [shortPrice1, setShortPrice1] = useState(0);
  const [shortPrice2, setShortPrice2] = useState(0);
  const [shortSellQty, setShortSellQty] = useState(0);
  const [shortSellPrice, setShortSellPrice] = useState(0);
  const [shortSellValue, setShortSellValue] = useState(0);
  const [shortBuyQty1, setShortBuyQty1] = useState(0);
  const [shortBuyQty2, setShortBuyQty2] = useState(0);
  const [shortTarget1, setShortTarget1] = useState(0);
  const [shortTarget2, setShortTarget2] = useState(0);
  const [shortBuyPrice1, setShortBuyPrice1] = useState(0);
  const [shortBuyPrice2, setShortBuyPrice2] = useState(0);
  const [shortBuyValue1, setShortBuyValue1] = useState(0);
  const [shortBuyValue2, setShortBuyValue2] = useState(0);
  const [shortProfile, setShortProfile] = useState(0);
  const [shortProfilePercent, setShortProfilePercent] = useState(0);

  const [longBaseline, setLongBaseline] = useState(0);
  const [longPrice1, setLongPrice1] = useState(0);
  const [longPrice2, setLongPrice2] = useState(0);
  const [longSellQty1, setLongSellQty1] = useState(0);
  const [longSellPrice1, setLongSellPrice1] = useState(0);
  const [longSellValue1, setLongSellValue1] = useState(0);
  const [longSellQty2, setLongSellQty2] = useState(0);
  const [longSellPrice2, setLongSellPrice2] = useState(0);
  const [longSellValue2, setLongSellValue2] = useState(0);
  const [longBuyQty, setLongBuyQty] = useState(0);
  const [longTarget1, setLongTarget1] = useState(0);
  const [longTarget2, setLongTarget2] = useState(0);
  const [longBuyPrice, setLongBuyPrice] = useState(0);
  const [longBuyValue, setLongBuyValue] = useState(0);
  const [longProfile, setLongProfile] = useState(0);
  const [longProfilePercent, setLongProfilePercent] = useState(0);

  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (document.getElementById('tradingview_a35fb') && 'TradingView' in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: 'NASDAQ:AAPL',
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: 'tradingview_a35fb'
        });
      }
    }
  }, []);

  const handleChangeBaseline = (e) => {
    setShortBaseline(e.target.value);
  };

  const handleChangePrice1 = (e) => {
    setShortPrice1(e.target.value);
  };

  const handleChangePrice2 = (e) => {
    setShortPrice2(e.target.value);
  };

  const handleChangeSellQty = (e) => {
    setShortSellQty(e.target.value);
  };

  const handleChangeSellPrice = (e) => {
    setShortSellPrice(e.target.value);
  };

  const handleChangeBuyQty1 = (e) => {
    setShortBuyQty1(e.target.value);
  };

  const handleChangeBuyQty2 = (e) => {
    setShortBuyQty2(e.target.value);
  };

  const onClickShortCalculate = () => {
    setShortTarget1((Number(shortBaseline) * 10 ** 20 - Number(shortPrice1) * 10 ** 20 + Number(shortBaseline) * 10 ** 20) / 10 ** 20);
    setShortTarget2((Number(shortBaseline) * 10 ** 20 - Number(shortPrice2) * 10 ** 20 + Number(shortBaseline) * 10 ** 20) / 10 ** 20);
    setShortBuyPrice1((Number(shortBaseline) * 10 ** 20 - Number(shortPrice1) * 10 ** 20 + Number(shortBaseline) * 10 ** 20) / 10 ** 20);
    setShortBuyPrice2((Number(shortBaseline) * 10 ** 20 - Number(shortPrice2) * 10 ** 20 + Number(shortBaseline) * 10 ** 20) / 10 ** 20);
  };

  const onClickShortCalculate2 = () => {
    setShortSellValue(Number(shortSellQty) * Number(shortSellPrice));
    setShortBuyValue1(Number(-Number(shortBuyQty1)) * Number(shortBuyPrice1));
    setShortBuyValue2(Number(-Number(shortBuyQty2)) * Number(shortBuyPrice2));
    setShortProfile(
      Number(shortSellQty) * Number(shortSellPrice) +
        Number(-Number(shortBuyQty1)) * Number(shortBuyPrice1) +
        Number(-Number(shortBuyQty2)) * Number(shortBuyPrice2)
    );
    setShortProfilePercent(
      (
        ((Number(shortSellQty) * Number(shortSellPrice) +
          Number(-Number(shortBuyQty1)) * Number(shortBuyPrice1) +
          Number(-Number(shortBuyQty2)) * Number(shortBuyPrice2)) /
          (Number(shortSellQty) * Number(shortSellPrice))) *
        100
      ).toFixed(2)
    );
  };

  const onClickLongCalculate = () => {
    setLongTarget1((Number(longBaseline) * 10 ** 20 - Number(longPrice1) * 10 ** 20 + Number(longBaseline) * 10 ** 20) / 10 ** 20);
    setLongTarget2((Number(longBaseline) * 10 ** 20 - Number(longPrice2) * 10 ** 20 + Number(longBaseline) * 10 ** 20) / 10 ** 20);
    setLongSellPrice1((Number(longBaseline) * 10 ** 20 - Number(longPrice1) * 10 ** 20 + Number(longBaseline) * 10 ** 20) / 10 ** 20);
    setLongSellPrice2((Number(longBaseline) * 10 ** 20 - Number(longPrice2) * 10 ** 20 + Number(longBaseline) * 10 ** 20) / 10 ** 20);
  };

  const onClickLongCalculate2 = () => {
    setLongBuyValue(Number(-Number(longBuyQty)) * Number(longBuyPrice));
    setLongSellValue1(Number(longSellQty1) * Number(longSellPrice1));
    setLongSellValue2(Number(longSellQty2) * Number(longSellPrice2));
    setLongProfile(
      (
        (Number(-Number(longBuyQty)) * Number(longBuyPrice) * 10 ** 20 +
          Number(longSellQty1) * Number(longSellPrice1) * 10 ** 20 +
          Number(longSellQty2) * Number(longSellPrice2) * 10 ** 20) /
        10 ** 20
      ).toFixed(2)
    );
    setLongProfilePercent(
      (
        ((Number(-Number(longBuyQty)) * Number(longBuyPrice) * 10 ** 20 +
          Number(longSellQty1) * Number(longSellPrice1) * 10 ** 20 +
          Number(longSellQty2) * Number(longSellPrice2) * 10 ** 20) /
          10 ** 20 /
          Number(-(Number(-Number(longBuyQty)) * Number(longBuyPrice)))) *
        100
      ).toFixed(2)
    );
  };

  const onClickShortClear = () => {
    setShortBaseline(0);
    setShortPrice1(0);
    setShortPrice2(0);
    setShortSellQty(0);
    setShortSellPrice(0);
    setShortSellValue(0);
    setShortBuyQty1(0);
    setShortBuyQty2(0);
    setShortTarget1(0);
    setShortTarget2(0);
    setShortBuyPrice1(0);
    setShortBuyPrice2(0);
    setShortBuyValue1(0);
    setShortBuyValue2(0);
    setShortProfile(0);
    setShortProfilePercent(0);
  };

  const onClickLongClear = () => {
    setLongBaseline(0);
    setLongPrice1(0);
    setLongPrice2(0);
    setLongBuyQty(0);
    setLongBuyPrice(0);
    setLongBuyValue(0);
    setLongSellQty1(0);
    setLongSellQty2(0);
    setLongTarget1(0);
    setLongTarget2(0);
    setLongSellPrice1(0);
    setLongSellPrice2(0);
    setLongSellValue1(0);
    setLongSellValue2(0);
    setLongProfile(0);
    setLongProfilePercent(0);
  };

  return (
    <>
      <Stack direction="row" spacing={2} className="body">
        <Box className="body-left">
          <Stack spacing={2} className="body-direction">
            <Stack spacing={2} sx={{ flex: '1' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Stack spacing={1} direction="row">
                  <Typography variant="h5" sx={{ color: '#D1D4DC' }}>
                    Trade Calculator&nbsp;-&nbsp;Pattern(M)
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'red' }}>
                    Short
                  </Typography>
                </Stack>
                <Button variant="contained" onClick={() => onClickShortClear()}>
                  <ClearAllIcon />
                </Button>
              </Stack>
              <Box className="box-body">
                <Box className="box-body-item">
                  <Stack direction="row" spacing={2} className="box-header">
                    <Box className="padding-right">
                      <Typography className="input-label">Baseline</Typography>
                      <input type="number" className="item-input" onChange={handleChangeBaseline} value={shortBaseline} />
                    </Box>
                    <Box className="padding-right">
                      <Typography className="input-label">Price 1</Typography>
                      <input type="number" className="item-input" onChange={handleChangePrice1} value={shortPrice1} />
                    </Box>
                    <Box>
                      <Typography className="input-label">Price 2</Typography>
                      <input type="number" className="item-input" onChange={handleChangePrice2} value={shortPrice2} />
                    </Box>
                    <Button variant="contained" onClick={() => onClickShortCalculate()}>
                      <CalculateIcon />
                    </Button>
                    <Box className="padding-right">
                      <Typography className="input-label">Target 1</Typography>
                      <input type="number" className="item-input-result" value={shortTarget1} readOnly />
                    </Box>
                    <Box>
                      <Typography className="input-label">Target 2</Typography>
                      <input type="number" className="item-input-result" value={shortTarget2} readOnly />
                    </Box>
                  </Stack>
                </Box>
                <Box className="box-item">
                  <Box className="box-item-body">
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label2">Sell Qty</Typography>
                      <input type="number" className="calculator-input" onChange={handleChangeSellQty} value={shortSellQty} />
                      <Typography className="input-label2">Buy Qty</Typography>
                      <input type="number" className="calculator-input" onChange={handleChangeBuyQty1} value={shortBuyQty1} />
                      <input type="number" className="calculator-input" onChange={handleChangeBuyQty2} value={shortBuyQty2} />
                    </Stack>
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label2">Sell Price</Typography>
                      <input type="number" className="calculator-input" onChange={handleChangeSellPrice} value={shortSellPrice} />
                      <Typography className="input-label2">Buy Price</Typography>
                      <input
                        type="number"
                        className="calculator-input"
                        value={shortBuyPrice1}
                        onChange={(e) => setShortBuyPrice1(e.target.value)}
                      />
                      <input
                        type="number"
                        className="calculator-input"
                        value={shortBuyPrice2}
                        onChange={(e) => setShortBuyPrice2(e.target.value)}
                      />
                    </Stack>
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label2">Sell Value</Typography>
                      <input type="number" className="calculator-input-result" value={shortSellValue} readOnly />
                      <Typography className="input-label2">Buy Value</Typography>
                      <input type="number" className="calculator-input-result" value={shortBuyValue1} readOnly />
                      <input type="number" className="calculator-input-result" value={shortBuyValue2} readOnly />
                    </Stack>
                  </Box>
                  <Box sx={{ width: '100%', padding: '25px', paddingTop: '0px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" sx={{ flex: '0.3' }} onClick={() => onClickShortCalculate2()}>
                      <CalculateIcon />
                    </Button>
                    <Box sx={{ flex: '1' }}></Box>
                    <Box className="box-result">
                      <Typography sx={{ color: '#D1D4DC' }}>Profit</Typography>
                      <Typography sx={{ color: '#D1D4DC' }}>Profit %</Typography>
                    </Box>
                    <Box sx={{ flex: '1' }}></Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1', gap: '10px' }}>
                      <input type="number" className="calculator-input-result" value={shortProfile} readOnly />
                      <input type="number" className="calculator-input-result" value={shortProfilePercent} readOnly />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Stack>
            <Stack spacing={2} sx={{ flex: '1' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Stack spacing={1} direction="row">
                  <Typography variant="h5" sx={{ color: '#D1D4DC' }}>
                    Trade Calculator&nbsp;-&nbsp;Pattern(W)
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'green' }}>
                    Long
                  </Typography>
                </Stack>
                <Button variant="contained" onClick={() => onClickLongClear()}>
                  <ClearAllIcon />
                </Button>
              </Stack>
              <Box className="box-body">
                <Box className="box-body-item">
                  <Stack direction="row" spacing={2} className="box-header">
                    <Box sx={{ width: '20%', paddingRight: '10px' }}>
                      <Typography className="input-label">Baseline</Typography>
                      <input
                        type="number"
                        className="item-input"
                        onChange={(e) => {
                          setLongBaseline(e.target.value);
                        }}
                        value={longBaseline}
                      />
                    </Box>
                    <Box sx={{ width: '20%', paddingRight: '10px' }}>
                      <Typography className="input-label">Price 1</Typography>
                      <input
                        type="number"
                        className="item-input"
                        onChange={(e) => {
                          setLongPrice1(e.target.value);
                        }}
                        value={longPrice1}
                      />
                    </Box>
                    <Box sx={{ width: '20%' }}>
                      <Typography className="input-label">Price 2</Typography>
                      <input
                        type="number"
                        className="item-input"
                        onChange={(e) => {
                          setLongPrice2(e.target.value);
                        }}
                        value={longPrice2}
                      />
                    </Box>
                    <Button variant="contained" onClick={() => onClickLongCalculate()}>
                      <CalculateIcon />
                    </Button>
                    <Box sx={{ width: '20%', paddingRight: '10px' }}>
                      <Typography className="input-label">Target 1</Typography>
                      <input type="number" className="item-input-result" value={longTarget1} readOnly />
                    </Box>
                    <Box sx={{ width: '20%' }}>
                      <Typography className="input-label">Target 2</Typography>
                      <input type="number" className="item-input-result" value={longTarget2} readOnly />
                    </Box>
                  </Stack>
                </Box>
                <Box className="box-item">
                  <Box className="box-item-body">
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label2">Buy Qty</Typography>
                      <input
                        type="number"
                        className="calculator-input"
                        onChange={(e) => setLongBuyQty(e.target.value)}
                        value={longBuyQty}
                      />
                      <Typography className="input-label2">Sell Qty</Typography>
                      <input
                        type="number"
                        className="calculator-input"
                        onChange={(e) => setLongSellQty1(e.target.value)}
                        value={longSellQty1}
                      />
                      <input
                        type="number"
                        className="calculator-input"
                        onChange={(e) => setLongSellQty2(e.target.value)}
                        value={longSellQty2}
                      />
                    </Stack>
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label2">Buy Price</Typography>
                      <input
                        type="number"
                        className="calculator-input"
                        onChange={(e) => setLongBuyPrice(e.target.value)}
                        value={longBuyPrice}
                      />
                      <Typography className="input-label2">Sell Price</Typography>
                      <input
                        type="number"
                        className="calculator-input"
                        value={longSellPrice1}
                        onChange={(e) => setLongSellPrice1(e.target.value)}
                      />
                      <input
                        type="number"
                        className="calculator-input"
                        value={longSellPrice2}
                        onChange={(e) => setLongSellPrice2(e.target.value)}
                      />
                    </Stack>
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label2">Buy Value</Typography>
                      <input type="number" className="calculator-input-result" value={longBuyValue} readOnly />
                      <Typography className="input-label2">Sell Value</Typography>
                      <input type="number" className="calculator-input-result" value={longSellValue1} readOnly />
                      <input type="number" className="calculator-input-result" value={longSellValue2} readOnly />
                    </Stack>
                  </Box>
                  <Box sx={{ width: '100%', padding: '25px', paddingTop: '0px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" sx={{ flex: '0.3' }} onClick={() => onClickLongCalculate2()}>
                      <CalculateIcon />
                    </Button>
                    <Box sx={{ flex: '1' }}></Box>
                    <Box className="box-result">
                      <Typography sx={{ color: '#D1D4DC' }}>Profit</Typography>
                      <Typography sx={{ color: '#D1D4DC' }}>Profit %</Typography>
                    </Box>
                    <Box sx={{ flex: '1' }}></Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1', gap: '10px' }}>
                      <input type="number" className="calculator-input-result" value={longProfile} readOnly />
                      <input type="number" className="calculator-input-result" value={longProfilePercent} readOnly />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Box>
        <div className="tradingview-widget-container" style={{ height: '100%', width: '50%' }}>
          <div id="tradingview_a35fb" style={{ height: '100%', width: '100%' }} />
        </div>
      </Stack>
    </>
  );
};

export default PatternCalculator;
/* eslint-disable */

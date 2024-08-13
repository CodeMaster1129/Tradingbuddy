/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CalculateIcon from '@mui/icons-material/Calculate';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import './RiskManagementCalculator.css';

let tvScriptLoadingPromise;

const PatternCalculator = () => {
  const [tradeAccount, setTradeAccount] = useState(0);
  const [riskLevel, setRiskLevel] = useState(0);
  const [totalTrade, setTotalTrade] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);
  const [risk, setRisk] = useState(0);
  const [riskAmt, setRiskAmt] = useState(0);
  const [exitPrice, setExitPrice] = useState(0);
  const [share, setShare] = useState(0);

  const [target1Price, setTarget1Price] = useState(0);
  const [target2Price, setTarget2Price] = useState(0);
  const [target3Price, setTarget3Price] = useState(0);

  const [target1ProfitPerShare, setTarget1ProfitPerShare] = useState(0);
  const [target2ProfitPerShare, setTarget2ProfitPerShare] = useState(0);
  const [target3ProfitPerShare, setTarget3ProfitPerShare] = useState(0);

  const [target1Profit, setTarget1Profit] = useState(0);
  const [target2Profit, setTarget2Profit] = useState(0);
  const [target3Profit, setTarget3Profit] = useState(0);

  const [profitTarget1, setProfitTarget1] = useState(0);
  const [profitTarget2, setProfitTarget2] = useState(0);
  const [profitTarget3, setProfitTarget3] = useState(0);

  const [contracts, setContracts] = useState(0);

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

  const onClickCalculator = () => {
    setTotalTrade((Number(tradeAccount) * Number(riskLevel)) / 100);
    setRiskAmt(((Number(entryPrice) * Number(risk)) / 100).toFixed(2));
    setExitPrice((Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2));

    const calculatedShare =
      (Number(tradeAccount) * Number(riskLevel)) /
      100 /
      (Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100));
    setShare(Number.isNaN(calculatedShare) ? 0 : calculatedShare);

    setTarget1Price(
      ((Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 1 + Number(entryPrice)).toFixed(
        2
      )
    );
    setTarget2Price(
      ((Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 2 + Number(entryPrice)).toFixed(
        2
      )
    );
    setTarget3Price(
      ((Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 3 + Number(entryPrice)).toFixed(
        2
      )
    );
    setTarget1ProfitPerShare(
      (
        (
          (Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 1 +
          Number(entryPrice)
        ).toFixed(2) - Number(entryPrice)
      ).toFixed(2)
    );
    setTarget2ProfitPerShare(
      (
        (
          (Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 2 +
          Number(entryPrice)
        ).toFixed(2) - Number(entryPrice)
      ).toFixed(2)
    );
    setTarget3ProfitPerShare(
      (
        (
          (Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 3 +
          Number(entryPrice)
        ).toFixed(2) - Number(entryPrice)
      ).toFixed(2)
    );
    setTarget1Profit(
      (
        ((
          (Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 1 +
          Number(entryPrice)
        ).toFixed(2) -
          Number(entryPrice)) /
        Number(entryPrice)
      ).toFixed(2) * 100
    );
    setTarget2Profit(
      (
        ((
          (Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 2 +
          Number(entryPrice)
        ).toFixed(2) -
          Number(entryPrice)) /
        Number(entryPrice)
      ).toFixed(2) * 100
    );
    setTarget3Profit(
      (
        ((
          (Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 3 +
          Number(entryPrice)
        ).toFixed(2) -
          Number(entryPrice)) /
        Number(entryPrice)
      ).toFixed(2) * 100
    );
    setProfitTarget1(
      (
        (
          (
            (Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 1 +
            Number(entryPrice)
          ).toFixed(2) - Number(entryPrice)
        ).toFixed(2) * calculatedShare
      ).toFixed(2)
    );
    setProfitTarget2(
      (
        (
          (
            (Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 2 +
            Number(entryPrice)
          ).toFixed(2) - Number(entryPrice)
        ).toFixed(2) * calculatedShare
      ).toFixed(2)
    );
    setProfitTarget3(
      (
        (
          (
            (Number(entryPrice) - (Number(entryPrice) - (Number(entryPrice) * Number(risk)) / 100).toFixed(2)) * 3 +
            Number(entryPrice)
          ).toFixed(2) - Number(entryPrice)
        ).toFixed(2) * calculatedShare
      ).toFixed(2)
    );
    setContracts(Math.round(calculatedShare / 100));
  };

  const onClickClear = () => {
    setTradeAccount(0);
    setRiskLevel(0);
    setTotalTrade(0);
    setEntryPrice(0);
    setRisk(0);
    setRiskAmt(0);
    setExitPrice(0);
    setShare(0);
    setTarget1Price(0);
    setTarget2Price(0);
    setTarget3Price(0);
    setTarget1ProfitPerShare(0);
    setTarget2ProfitPerShare(0);
    setTarget3ProfitPerShare(0);
    setTarget1Profit(0);
    setTarget2Profit(0);
    setTarget3Profit(0);
    setProfitTarget1(0);
    setProfitTarget2(0);
    setProfitTarget3(0);
    setContracts(0);
  };

  return (
    <>
      <Stack direction="row" spacing={2} className="body">
        <Box className="body-left">
          <Stack spacing={2} className="body-direction">
            <Stack spacing={2} sx={{ flex: '1' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Typography variant="h5" sx={{ color: '#D1D4DC' }}>
                  Risk Management Stock Trade Calculator
                </Typography>
                <Button variant="contained" onClick={() => onClickClear()}>
                  <ClearAllIcon />
                </Button>
              </Stack>
              <Box className="box-body">
                <Box className="box-body-item">
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className="box-header">
                    <Stack sx={{ padding: '10px' }} direction="column" justifyContent="center" alignItems="center" spacing={1}>
                      <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                        <Typography className="input-label">Trade Account Balance</Typography>
                        <input
                          type="number"
                          className="item-input"
                          style={{ width: '100px', height: '25px' }}
                          value={tradeAccount}
                          onChange={(e) => {
                            setTradeAccount(e.target.value);
                          }}
                        />
                      </Stack>
                      <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                        <Typography className="input-label">Risk Level Per Trade %&nbsp;</Typography>
                        <input
                          type="number"
                          className="item-input"
                          style={{ width: '100px', height: '25px' }}
                          value={riskLevel}
                          onChange={(e) => {
                            setRiskLevel(e.target.value);
                          }}
                        />
                      </Stack>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                      <Typography className="input-label">Total Trade Risk</Typography>
                      <input
                        type="number"
                        className="item-input-result"
                        style={{ width: '100px', height: '25px' }}
                        value={totalTrade}
                        readOnly
                      />
                    </Stack>
                  </Stack>
                </Box>
                <Box className="box-item">
                  <Box className="box-item-body">
                    <Stack direction="row" className="stack-direction">
                      <Box sx={{ flex: '2+30px' }}>
                        <Stack direction="row" sx={{ paddingBottom: '10px' }}>
                          <Box sx={{ flex: '1', paddingRight: '30px' }}>
                            <Stack direction="column">
                              <Typography className="input-label2" sx={{ marginBottom: '10px' }}>
                                Entry Price
                              </Typography>
                              <Typography className="input-label2">Risk %</Typography>
                            </Stack>
                          </Box>
                          <Box sx={{ flex: '1' }}>
                            <Stack direction="column">
                              <input
                                type="number"
                                className="calculator-input"
                                value={entryPrice}
                                onChange={(e) => {
                                  setEntryPrice(e.target.value);
                                }}
                                style={{ marginBottom: '10px' }}
                              />
                              <input
                                type="number"
                                className="calculator-input"
                                value={risk}
                                onChange={(e) => {
                                  setRisk(e.target.value);
                                }}
                              />
                            </Stack>
                          </Box>
                        </Stack>

                        {/* <Stack direction="column">
                          <Stack direction="row" sx={{ flex: '1' }}>
                            <Typography className="input-label2">Entry Price</Typography>
                            <input
                              type="number"
                              className="calculator-input"
                              value={entryPrice}
                              onChange={(e) => {
                                setEntryPrice(e.target.value);
                              }}
                            />
                          </Stack>
                          <Stack direction="row" sx={{ flex: '1' }}>
                            <Typography className="input-label2">Risk %</Typography>
                            <input
                              type="number"
                              className="calculator-input"
                              value={risk}
                              onChange={(e) => {
                                setRisk(e.target.value);
                              }}
                            />
                          </Stack>
                        </Stack> */}
                      </Box>

                      <Box sx={{ flex: '1' }}>
                        <Button variant="contained" sx={{ flex: '0.3', gap: '30px' }} onClick={() => onClickCalculator()}>
                          <CalculateIcon />
                        </Button>
                      </Box>
                      <Typography className="input-label2">Target Price</Typography>
                      <Typography className="input-label2">Profit Per Share</Typography>
                      <Typography className="input-label2">Profit Target%</Typography>
                    </Stack>
                  </Box>
                  <Box className="box-item-body2">
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label2">Risk Amt</Typography>

                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={riskAmt} readOnly />
                      </Box>
                      <Typography className="input-label2">Target (1x)</Typography>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={target1Price} readOnly />
                      </Box>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={target1ProfitPerShare} readOnly />
                      </Box>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={target1Profit} readOnly />
                      </Box>
                    </Stack>
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label2">Exit Price</Typography>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={exitPrice} readOnly />
                      </Box>
                      <Typography className="input-label2">Target (2x)</Typography>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={target2Price} readOnly />
                      </Box>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={target2ProfitPerShare} readOnly />
                      </Box>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={target2Profit} readOnly />
                      </Box>
                    </Stack>
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label2">Shares</Typography>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={Math.round(share)} readOnly />
                      </Box>
                      <Typography className="input-label2">Target (3x)</Typography>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={target3Price} readOnly />
                      </Box>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={target3ProfitPerShare} readOnly />
                      </Box>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={target3Profit} readOnly />
                      </Box>
                    </Stack>
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label2">Contracts</Typography>
                      <Box sx={{ flex: '1' }}>
                        <input type="number" className="calculator-input-result" value={contracts} readOnly />
                      </Box>

                      <Box sx={{ flex: '1' }}></Box>
                      <Box sx={{ flex: '1' }}></Box>
                      <Box sx={{ flex: '1' }}></Box>
                      <Box sx={{ flex: '1' }}></Box>
                    </Stack>
                  </Box>
                  <Box className="box-item-footer">
                    <Stack direction="row" className="stack-direction">
                      <Typography className="input-label-target">Profit Target$</Typography>
                      <Stack direction="column" spacing={2} sx={{ flex: '1' }}>
                        <Typography className="input-label2" sx={{ display: 'flex', justifyContent: 'center' }}>
                          Target (1x)
                        </Typography>
                        <input type="number" className="calculator-input-result" value={profitTarget1} readOnly />
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ flex: '1' }}>
                        <Typography className="input-label2" sx={{ display: 'flex', justifyContent: 'center' }}>
                          Target (2x)
                        </Typography>
                        <input type="number" className="calculator-input-result" value={profitTarget2} readOnly />
                      </Stack>
                      <Stack direction="column" spacing={2} sx={{ flex: '1' }}>
                        <Typography className="input-label2" sx={{ display: 'flex', justifyContent: 'center' }}>
                          Target (3x)
                        </Typography>
                        <input type="number" className="calculator-input-result" value={profitTarget3} readOnly />
                      </Stack>
                      <Box sx={{ flex: '1' }} />
                      <Box sx={{ flex: '1' }}></Box>
                    </Stack>
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

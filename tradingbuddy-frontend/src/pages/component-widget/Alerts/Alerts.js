/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Alerts.css';

import DiscordImg from '../../../assets/images/alert/discord-v2-svgrepo-com.png';
import TelegramImg from '../../../assets/images/alert/telegram-svgrepo-com.png';
import A1TradingImg from '../../../assets/images/alert/A1Trading.png';
import MarketMakersImg from '../../../assets/images/alert/MarketMakers.png';
import BuyAlertsImg from '../../../assets/images/alert/BuyAlerts.png';
import TradeAlgoImg from '../../../assets/images/alert/TradeAlgo.png';
import USAForexImg from '../../../assets/images/alert/USAForex.png';

const Alerts = () => {
  const [discordData, setDiscordData] = useState([]);
  const [discordSignalData, setDiscordSignalData] = useState([]);
  const [telegramData, setTelegramData] = useState([]);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/alert/gettelegramdata`,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => {
      if (res.status === 200) setTelegramData(res.data.telegramdata);
    });
  }, []);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/alert/getalertdiscorddata`,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => {
      if (res.status === 200) setDiscordData(res.data.discorddata);
    });
  }, []);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/alert/getsignaldiscorddata`,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => {
      if (res.status === 200) setDiscordSignalData(res.data.discorddata);
    });
  }, []);

  discordData.sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateB - dateA;
  });

  let USAFOREXData = telegramData.filter((item) => item[1] === '1221069394');
  let MarketMakersData = telegramData.filter((item) => item[1] === '1860456700');
  let BuyAlertsData = telegramData.filter((item) => item[1] === '1557173806');
  let TradeAlgoData1 = telegramData.filter((item) => item[1] === '1629543083');
  let TradeAlgoData2 = telegramData.filter((item) => item[1] === '1402449403');
  let TradeAlgoData = TradeAlgoData1.concat(TradeAlgoData2);

  USAFOREXData.sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateB - dateA;
  });
  MarketMakersData.sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateB - dateA;
  });
  BuyAlertsData.sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateB - dateA;
  });
  TradeAlgoData.sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateB - dateA;
  });

  discordSignalData.sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateB - dateA;
  });

  return (
    <div className="alert-main">
      <div className="main">
        <div className="left-side">
          <div className="item-header">
            <img src={DiscordImg} alt="logo" className="image" />
            <div className="image-header">DISCORD</div>
            <div className="image-content">Trade Alerts</div>
          </div>
          <div className="item-content">
            <img src={A1TradingImg} className="item-content-image" />
            <div className="item-content-title">A1 trading</div>
          </div>
          <div className="item-content-map">
            {discordData.map((item, index) => (
              <div key={index} style={{ borderBottom: '1px solid #D3D3D3' }}>
                <div className="item-content-div">{item[0]}</div>
                <div className="item-content-div">{item[2].split('⚠️')[0].trim()}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="left-side">
          <div className="item-header">
            <img src={DiscordImg} alt="logo" className="image" />
            <div className="image-header">DISCORD</div>
            <div className="image-content">Edgefinder Signals</div>
          </div>
          <div className="item-content">
            <img src={A1TradingImg} className="item-content-image" />
            <div className="item-content-title">A1 trading</div>
          </div>
          <div className="item-content-map">
            {discordSignalData.map((item, index) => (
              <div key={index} style={{ borderBottom: '1px solid #D3D3D3' }}>
                {item[1] === '1154092424063369287' ? (
                  <div className="item-content-div" style={{ color: '#1890FF' }}>
                    Top Setups
                  </div>
                ) : item[1] === '1155952272635863192' ? (
                  <div className="item-content-div" style={{ color: '#1890FF' }}>
                    Cot Report
                  </div>
                ) : item[1] === '1171526270815846400' ? (
                  <div className="item-content-div" style={{ color: '#1890FF' }}>
                    Retail Sentiment
                  </div>
                ) : (
                  <div className="item-content-div" style={{ color: '#1890FF' }}>
                    Score Flip
                  </div>
                )}
                <div className="item-content-div">{item[0]}</div>
                <div className="item-content-div">{item[2].replace(/:\w+:/g, '').trim()}</div>
                <div className="item-content-div">{item[3]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="right-side">
          <div className="item-header">
            <img src={TelegramImg} alt="logo" className="image" />
            <div className="image-header">TELEGRAM</div>
            <div className="image-content">Trade Alerts</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', flexGrow: '1' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', flexGrow: '1', maxWidth: '25%' }}>
              <div className="item-content">
                <img src={MarketMakersImg} className="item-content-image" />
                <div className="item-content-title">MarketMakers</div>
              </div>
              <div className="item-content-map">
                {MarketMakersData.map((item, index) => (
                  <div key={index} style={{ borderBottom: '1px solid #D3D3D3' }}>
                    <div className="item-content-div">{item[0]}</div>
                    <div className="item-content-div">{item[2]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', flexGrow: '1', maxWidth: '25%' }}>
              <div className="item-content">
                <img src={BuyAlertsImg} className="item-content-image" />
                <div className="item-content-title">BuyAlerts</div>
              </div>
              <div className="item-content-map">
                {BuyAlertsData.map((item, index) => (
                  <div key={index} style={{ borderBottom: '1px solid #D3D3D3' }}>
                    <div className="item-content-div">{item[0]}</div>
                    <div className="item-content-div">{item[2]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', flexGrow: '1', maxWidth: '25%' }}>
              <div className="item-content">
                <img src={TradeAlgoImg} className="item-content-image" />
                <div className="item-content-title">TradeAlgo</div>
              </div>
              <div className="item-content-map">
                {TradeAlgoData.map((item, index) => (
                  <div key={index} style={{ borderBottom: '1px solid #D3D3D3' }}>
                    <div className="item-content-div">{item[0]}</div>
                    <div className="item-content-div">{item[2]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', flexGrow: '1', maxWidth: '25%' }}>
              <div className="item-content">
                <img src={USAForexImg} className="item-content-image" />
                <div className="item-content-title">USA FOREX</div>
              </div>
              <div className="item-content-map">
                {USAFOREXData.map((item, index) => (
                  <div key={index} style={{ borderBottom: '1px solid #D3D3D3' }}>
                    <div className="item-content-div">{item[0]}</div>
                    <div className="item-content-div">{item[2]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
/* eslint-disable */

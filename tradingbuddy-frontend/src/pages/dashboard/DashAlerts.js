/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';

import DiscordImg from '../../assets/images/alert/discord-v2-svgrepo-com.png';
import PatreonImg from '../../assets/images/alert/patreon-v2-svgrepo-com.png';
import TelegramImg from '../../assets/images/alert/telegram-svgrepo-com.png';
import A1TradingImg from '../../assets/images/alert/A1Trading.png';
import MyTradingJournalImg from '../../assets/images/alert/MyTradingJournal.png';
import MarketMakersImg from '../../assets/images/alert/MarketMakers.png';
import BuyAlertsImg from '../../assets/images/alert/BuyAlerts.png';
import TradeAlgoImg from '../../assets/images/alert/TradeAlgo.png';
import USAForexImg from '../../assets/images/alert/USAForex.png';

export default function DashAlerts() {
  const [discordData, setDiscordData] = useState([]);
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

  let data = discordData.concat(telegramData);

  data.sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateB - dateA;
  });

  let tempData = data.slice(0, 100);

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
      <div className="scrollbar" style={{ height: '100%', width: '100%', overflow: 'auto' }}>
        <div
          style={{
            color: '#d1d4dc ',
            background: '#1e222d',
            width: '100%',
            fontSize: '14px',
            paddingLeft: '5px',
            paddingRight: '5px',
            paddingTop: '5px'
          }}
        >
          Trade Alerts
        </div>
        <div>
          {tempData.map((item, index) => (
            <div key={index} style={{ width: '100%', borderBottom: '1px solid #D3D3D3', padding: '3px' }}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {item[1].length === 19 ? (
                  <img src={A1TradingImg} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                ) : item[1] === '1557173806' ? (
                  <img src={BuyAlertsImg} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                ) : item[1] === '1860456700' ? (
                  <img src={MarketMakersImg} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                ) : item[1] === '1221069394' ? (
                  <img src={USAForexImg} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                ) : (
                  <img src={TradeAlgoImg} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                )}
                {item.length === 3 ? (
                  <img src={TelegramImg} style={{ width: '30px', height: '30px', marginTop: '10px', marginLeft: '20px' }} />
                ) : (
                  <img src={DiscordImg} style={{ width: '30px', height: '30px', marginTop: '10px', marginLeft: '20px' }} />
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'rgb(188, 188, 188)', marginBottom: '2px' }}>{item[0]}</div>
              <div style={{ fontSize: '12px', color: 'rgb(188, 188, 188)', overflowWrap: 'break-word' }}>
                {item[2].split('⚠️')[0].trim()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* eslint-disable */

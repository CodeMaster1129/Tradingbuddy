/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import DiscordImg from '../../assets/images/alert/discord-v2-svgrepo-com.png';
import A1TradingImg from '../../assets/images/alert/A1Trading.png';

export default function DashSignal() {
  const [discordData, setDiscordData] = useState([]);

  useEffect(() => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/alert/getsignaldiscorddata`,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => {
      if (res.status === 200) setDiscordData(res.data.discorddata);
    });
  }, []);

  discordData.sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateB - dateA;
  });

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
          Signals
        </div>
        <div>
          {discordData.map((item, index) => (
            <div key={index} style={{ width: '100%', borderBottom: '1px solid #D3D3D3', padding: '3px' }}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img src={A1TradingImg} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />

                <img src={DiscordImg} style={{ width: '30px', height: '30px', marginTop: '10px', marginLeft: '20px' }} />
              </div>
              {item[1] === '1154092424063369287' ? (
                <div style={{ fontSize: '12px', color: 'rgb(24, 144, 255)' }}>Top Setups</div>
              ) : item[1] === '1155952272635863192' ? (
                <div style={{ fontSize: '12px', color: 'rgb(24, 144, 255)' }}>Cot Report</div>
              ) : item[1] === '1171526270815846400' ? (
                <div style={{ fontSize: '12px', color: 'rgb(24, 144, 255)' }}>Retail Sentiment</div>
              ) : (
                <div style={{ fontSize: '12px', color: 'rgb(24, 144, 255)' }}>Score Flip</div>
              )}
              <div style={{ fontSize: '12px', color: 'rgb(188, 188, 188)', marginBottom: '2px' }}>{item[0]}</div>
              <div style={{ fontSize: '12px', color: 'rgb(188, 188, 188)' }}>{item[2].replace(/:\w+:/g, '').trim()}</div>
              <div style={{ fontSize: '12px', color: 'rgb(188, 188, 188)' }}>{item[3]}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* eslint-disable */

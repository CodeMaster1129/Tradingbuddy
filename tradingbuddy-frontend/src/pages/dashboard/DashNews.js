import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';

export default function DashNews({ symbol, submit }) {
  const [news, setNews] = useState([]);
  const [broker, setBroker] = useState('');

  useEffect(() => {
    const symbolData = async () => {
      var bodyFormData = new FormData();
      bodyFormData.append('symbol', symbol);
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/activity/technicalguage`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        if (res.status === 200) setBroker(res.data.data.broker);
      });
    };
    symbolData();
  }, [submit]);

  const getNewsData = async () => {
    if (broker === 'OANDA') {
      try {
        let str1 = symbol.slice(0, 3).toUpperCase();
        let str2 = symbol.slice(3, 6).toUpperCase();
        let res = await axios({
          method: 'GET',
          url: 'https://real-time-finance-data.p.rapidapi.com/currency-news',
          params: {
            from_symbol: `${str1}`,
            to_symbol: `${str2}`,
            language: 'en'
          },
          headers: {
            'X-RapidAPI-Key': `${process.env.REACT_APP_RapidAPI_Key}`,
            'X-RapidAPI-Host': `${process.env.REACT_APP_RapidAPI_Host}`
          }
        });

        if (res.data !== null) {
          setNews(res.data.data.news);
        }
      } catch (e) {
        console.log('error', e);
      }
    } else {
      try {
        let res = await axios({
          method: 'GET',
          url: 'https://real-time-finance-data.p.rapidapi.com/stock-news',
          params: {
            symbol: `${symbol}`,
            language: 'en'
          },
          headers: {
            'X-RapidAPI-Key': `${process.env.REACT_APP_RapidAPI_Key}`,
            'X-RapidAPI-Host': `${process.env.REACT_APP_RapidAPI_Host}`
          }
        });

        if (res.data !== null) {
          setNews(res.data.data.news);
        }
      } catch (e) {
        console.log('error', e);
      }
    }
  };

  useEffect(() => {
    getNewsData();
  }, [submit, broker]);

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
          News & Headlines
        </div>
        <div>
          {news
            ?.filter((item) => moment(item.post_time_utc).isBefore(moment()))
            .map((item, index) => (
              <div key={index} style={{ width: '100%', height: '100px', borderBottom: '1px solid #D3D3D3', paddingLeft: '3px' }}>
                <div
                  style={{
                    display: '-webkit-box',
                    justifyContent: 'space-between',
                    color: '#f7525f',
                    width: '100%',
                    fontSize: '10px',
                    marginTop: '5px'
                  }}
                >
                  <div>{moment(item.post_time_utc).tz('America/New_York').format('M/D/YYYY h:mm A')}</div> {/* Convert UTC time to EST */}
                  <div>{' - ' + item.source} </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', paddingTop: '5px', color: '#BCBCBC' }}> {item.article_title} </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

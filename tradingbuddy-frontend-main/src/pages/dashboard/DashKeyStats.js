/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashKeyStats({ symbol, submit }) {
  const [keyStats, setKeyStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
        params: {
          region: 'US',
          symbols: `${symbol}`
        },
        headers: {
          'X-RapidAPI-Key': `${process.env.REACT_APP_RapidAPI_Key}`,
          'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setKeyStats(response.data.quoteResponse.result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [submit]);

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
      <div className="scrollbar" style={{ height: '100%', width: '100%', overflow: 'auto', paddingRight: '5px' }}>
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
          Key Stats
        </div>
        <div>
          {keyStats.map((item, index) => (
            <div key={index}>
              <div style={{ paddingBottom: '10px', borderRadius: '5px', fontSize: '12px' }}>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>Float</div>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>{item.floatShares.toLocaleString()}</div>
              </div>
              <div style={{ paddingBottom: '10px', borderRadius: '5px', fontSize: '12px' }}>
                <div style={{ background: '#ffffff1a', textAlign: 'center', color: '#d1d4dc', display: 'flex', justifyContent: 'center' }}>
                  <div>Short Ratio: &nbsp;</div>
                  <div>{item.shortRatio}</div>
                </div>
                <div style={{ background: '#ffffff1a', textAlign: 'center', color: '#d1d4dc', display: 'flex', justifyContent: 'center' }}>
                  <div>Short % of Float: &nbsp;</div>
                  <div>{item.shortPercentFloat}%</div>
                </div>
              </div>
              <div style={{ paddingBottom: '10px', borderRadius: '5px', fontSize: '12px' }}>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>Regular Market Volume</div>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>{item.regularMarketVolume.toLocaleString()}</div>
              </div>
              <div style={{ paddingBottom: '10px', borderRadius: '5px', fontSize: '12px' }}>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>Avg 90 Day Volume</div>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>{item.averageDailyVolume3Month.toLocaleString()}</div>
              </div>
              <div style={{ paddingBottom: '10px', borderRadius: '5px', fontSize: '12px' }}>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>Avg 10 Day Volume</div>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>{item.averageDailyVolume10Day.toLocaleString()}</div>
              </div>
              <div style={{ paddingBottom: '10px', borderRadius: '5px', fontSize: '12px' }}>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>Outstanding Shares</div>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>{item.sharesOutstanding.toLocaleString()}</div>
              </div>
              <div style={{ paddingBottom: '10px', borderRadius: '5px', fontSize: '12px' }}>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>Market Cap</div>
                <div style={{ textAlign: 'center', color: '#d1d4dc', background: '#ffffff1a' }}>{item.marketCap.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* eslint-disable */

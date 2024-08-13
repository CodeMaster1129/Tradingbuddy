/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TechnicalGuage = ({ symbol, submit }) => {
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
        if (res.status === 200) {
          const container = document.getElementById('tradingview-widget-container');
          if (container) {
            const oldScript = document.getElementById('tradingview-widget');
            if (oldScript) {
              oldScript.remove();
            }

            const script = document.createElement('script');
            script.id = 'tradingview-widget';
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
              interval: '1m',
              width: '100%',
              height: '100%',
              symbol: `${res.data.data.broker.toUpperCase()}:${symbol.toUpperCase()}`,
              showIntervalTabs: true,
              locale: 'en',
              colorTheme: 'dark'
            });

            container.appendChild(script);
          }
        }
      });
    };

    symbolData();
  }, [submit]);

  return (
    <div id="tradingview-widget-container" className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .tradingview-widget-container::-webkit-scrollbar {
          background: #424242;
        }
        .tradingview-widget-container {
          scrollbar-color: #424242;
        }
      `
        }}
      />
    </div>
  );
};

export default TechnicalGuage;

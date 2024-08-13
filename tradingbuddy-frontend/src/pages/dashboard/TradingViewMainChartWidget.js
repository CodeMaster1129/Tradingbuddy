// TradingViewtMainChartWidget.jsx
/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import './style/mainDashboardLayout.css';
import './style/styles.css';
import axios from 'axios';

export default function TradingViewMainChartWidget({ symbol, submit }) {
  const createWidget = (broker) => {
    if (document.getElementById('tradingview_523de') && 'TradingView' in window) {
      new window.TradingView.widget({
        width: '99%',
        height: '96%',
        symbol: `${broker.toUpperCase()}:${symbol.toUpperCase()}`,
        interval: '30',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        enable_publishing: false,
        hide_side_toolbar: false,
        gridColor: 'rgba(216, 216, 216, 0.06)',
        allow_symbol_change: true,
        container_id: 'tradingview_523de'
      });
    }
  };

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
          new Promise((resolve) => {
            const script = document.createElement('script');
            script.id = 'tradingview-widget-loading-script';
            script.src = 'https://s3.tradingview.com/tv.js';
            script.type = 'text/javascript';
            script.onload = resolve;

            document.head.appendChild(script);
          })
            .then(() => {
              createWidget(res.data.data.broker);
            })
            .catch((err) => console.log(err));
        }
      });
    };

    symbolData();
  }, [submit]);

  return (
    <div className="tradingview-widget-container">
      <div style={{ fontSize: '14px', color: '#d1d4dc ', background: '#1e222d', paddingLeft: '7px' }}>Chart</div>
      <div id="tradingview_523de" />
    </div>
  );
}

/* eslint-disable */

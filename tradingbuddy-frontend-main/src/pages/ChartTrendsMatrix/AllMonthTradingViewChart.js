import React, { useEffect, useRef } from 'react';
import './ChartTrendsMatrix.css';
import { CHART_CONFIG } from '../../config/constants.js';

const AllMonthTradingViewChart = ({ symbol, broker, refreshToken }) => {
  const containerRef = useRef();

  useEffect(() => {
    const scriptElement = document.createElement('script');
    scriptElement.id = 'tradingview-widget';
    scriptElement.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    scriptElement.async = true;
    scriptElement.innerHTML = JSON.stringify({
      ...CHART_CONFIG,
      symbols: [[`${broker.toUpperCase()}:${symbol.toUpperCase()}|ALL`]],
      width: '692',
      height: '113',
      locale: 'en',
      dateRanges: ['all|1M']
    });

    // const oldScript = document.getElementById('tradingview-widget');

    // containerRef.current.removeChild(containerRef.current.firstChild);
    if (containerRef.current) {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(scriptElement);
    }
  }, [symbol, broker, refreshToken]);

  return (
    <div className="tradingview-widget-container" style={{ display: 'flex', flexDirection: 'column', paddingTop: '5px' }}>
      <h2>ALL 1 month</h2>
      <div ref={containerRef} className="tradingview-widget-container__widget" />
    </div>
  );
};

export default AllMonthTradingViewChart;

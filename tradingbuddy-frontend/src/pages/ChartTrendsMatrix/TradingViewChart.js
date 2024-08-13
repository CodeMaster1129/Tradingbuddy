import React, { useEffect, useRef } from 'react';
import './ChartTrendsMatrix.css';
import { CHART_CONFIG } from '../../config/constants.js';

const TradingViewChart = ({ title, symbol, dateRange, refreshToken }) => {
  const containerRef = useRef();
  useEffect(() => {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    scriptElement.async = true;
    scriptElement.innerHTML = JSON.stringify({
      ...CHART_CONFIG,
      symbols: [[symbol]],
      width: '170',
      height: '113',
      dateRanges: [dateRange]
    });
    if (containerRef.current) {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(scriptElement);
    }
  }, [title, symbol, dateRange, refreshToken, containerRef]);

  return (
    <div className="chart-container">
      <h2>{title}</h2>
      <div ref={containerRef} className="tradingview-widget-container__widget" />
    </div>
  );
};

export default TradingViewChart;

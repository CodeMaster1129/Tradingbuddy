/* eslint-disable */
import React, { useEffect, useRef } from 'react';

const StockHeatmap = () => {
  const containerEl = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      exchanges: [],
      dataSource: 'SPX500',
      grouping: 'sector',
      blockSize: 'market_cap_basic',
      blockColor: 'change',
      locale: 'en',
      symbolUrl: '',
      colorTheme: 'dark',
      hasTopBar: false,
      isDataSetEnabled: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      width: '100%',
      height: '100%'
    });
    containerEl.current.appendChild(script);
  }, []);

  return <div className="tradingview-widget-container" ref={containerEl}></div>;
};

export default StockHeatmap;

/* eslint-disable */

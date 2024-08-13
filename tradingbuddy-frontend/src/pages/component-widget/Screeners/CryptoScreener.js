/* eslint-disable */
import React, { useEffect, useRef } from 'react';

const CryptoScreener = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: '100%',
      defaultColumn: 'overview',
      defaultScreen: 'volume_leaders',
      market: 'crypto',
      showToolbar: true,
      colorTheme: 'dark',
      locale: 'en'
    });
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: '100%' }}></div>
    </div>
  );
};

export default CryptoScreener;
/* eslint-disable */

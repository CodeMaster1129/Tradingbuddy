/* eslint-disable */
import React, { useEffect, useRef } from 'react';

const DashEconomicCalendar = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark',
      isTransparent: false,
      width: '100%',
      height: '92%',
      locale: 'en',
      importanceFilter: '-1,0,1',
      currencyFilter: 'AUD,USD,CAD,CNY,EUR,FRF,DEM,JPY,NZD,CHF,GBP'
    });
    containerRef.current.appendChild(script);
  }, []);

  return (
    <>
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ fontSize: '14px', color: '#d1d4dc ', background: '#1e222d', paddingLeft: '7px' }}>Economic Calendar</div>
        <div className="tradingview-widget-container" ref={containerRef}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>
    </>
  );
};

export default DashEconomicCalendar;

/* eslint-disable */

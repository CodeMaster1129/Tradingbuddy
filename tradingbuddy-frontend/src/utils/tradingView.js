import React, { useEffect, useRef } from 'react';

const ChartComponent = (symbol) => {
  const chartContainerRef = useRef(null);
  const chartConfigurations = [
    {
      symbol: `OANDA:${symbol.symbol}|5D`,
      dateRange: '5d|60'
    }
  ];
  // Function to create a chart container and embed TradingView widget
  const createChartContainer = (configuration) => {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    chartContainerRef.current.innerHTML = ''; // Clear previous chart container
    chartContainerRef.current.appendChild(chartContainer);

    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.async = true;
    scriptElement.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    scriptElement.innerHTML = JSON.stringify({
      symbols: [[configuration.symbol]],
      chartOnly: true,
      width: '300',
      height: '200',
      locale: 'en',
      colorTheme: 'light',
      autosize: false,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: 'no',
      scaleMode: 'Normal',
      fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
      fontSize: '10',
      noTimeScale: true,
      valuesTracking: '1',
      changeMode: 'no-values',
      chartType: 'line',
      maLineColor: '#2962FF',
      maLineWidth: 1,
      maLength: 9,
      gridLineColor: 'rgba(209, 212, 220, 0.25)',
      lineWidth: 2,
      lineType: 2,
      dateRanges: [configuration.dateRange],
      upColor: '#22ab94',
      downColor: '#f7525f',
      borderUpColor: '#22ab94',
      borderDownColor: '#f7525f',
      wickUpColor: '#22ab94',
      wickDownColor: '#f7525f',
      noHeader: true
    });
    chartContainer.appendChild(scriptElement);
  };

  useEffect(() => {
    chartConfigurations.forEach(createChartContainer);
  }, [symbol.symbol]);

  return (
    <div>
      {/* TradingView Widget BEGIN */}
      <div className="tradingview-widget-container" ref={chartContainerRef}></div>
      {/* TradingView Widget END */}
    </div>
  );
};

export default ChartComponent;

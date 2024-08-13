import React from 'react';

const EarningsCalendarWidget = () => {
  const iframeStyle = {
    width: 'calc(100% - 100px)',
    height: '700px',
    border: '0', // 'frameBorder' in JSX translates to 'border' in CSS
    overflow: 'hidden' // 'scrolling="no"' translates to 'overflow: "hidden"' in CSS
  };

  return (
    <div style={{ padding: '30px' }}>
      <iframe style={iframeStyle} src="https://strike.market/widgets/earnings-calendar" title="Earnings Calendar" />
    </div>
  );
};

export default EarningsCalendarWidget;

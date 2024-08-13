/* eslint-disable */
import React, { useEffect, useRef } from 'react';

const FxDCATools = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleStyleChange = (msg) => {
      const widget = iframeRef.current;

      if (!widget) return;

      const styles = msg.data?.styles;
      if (styles) {
        Object.keys(styles).forEach((key) => widget.style.setProperty(key, styles[key]));
      }
    };
    window.addEventListener('message', handleStyleChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleStyleChange);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      width="100%"
      height="1000px"
      src="https://lookerstudio.google.com/embed/reporting/f4ba9a92-0421-4e4c-bc01-30dc52e0503c/page/RFxaD"
      frameBorder="0"
      style={{ border: 0, backgroundColor: '#1e222d' }}
      allowFullScreen
    />
  );
};

export default FxDCATools;
/* eslint-disable */

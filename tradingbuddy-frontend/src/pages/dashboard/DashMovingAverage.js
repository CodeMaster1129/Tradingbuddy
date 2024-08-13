/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DashMovingAverage = ({ symbol, submit }) => {
  const [symbolID, setSymbolID] = useState(0);

  useEffect(() => {
    const symbolData = async () => {
      var bodyFormData = new FormData();
      bodyFormData.append('symbol', symbol);
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/activity/getsymbolid`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        if (res.status === 200 && res.data.message === 'success') {
          setSymbolID(res.data.data[0]);
        }
      });
    };
    symbolData();
  }, [submit]);
  return (
    <>
      <div style={{ fontSize: '14px', color: '#d1d4dc ', background: '#1e222d', paddingLeft: '7px' }}>Moving Averages</div>
      <iframe
        src={`https://fxpricing.com/fx-widget/simple-moving-widget.php?id=${symbolID}&click_target=blank&theme=dark&tm-cr=1e222d&hr-cr=FFFFFF13&by-cr=28A745&sl-cr=DC3545&flags=circle&value_alignment=center&tab=5M,15M,30M,1H,4H,5H,1D,1W,M&lang=en&font=Arial, sans-serif`}
        width="100%"
        height="96%"
        style={{ border: '1px solid #434651', color: '#bcbcbc' }}
      ></iframe>
    </>
  );
};

export default DashMovingAverage;

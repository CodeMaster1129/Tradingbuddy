import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
import axios from 'axios';

export default function DailyPscores({ symbol, submit, scoreLoading, setScoreLoading }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const formData = new FormData();
    formData.append('symbol', symbol);
    axios
      .post(`${process.env.REACT_APP_API_URL}/activity/getPrometheusRating`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        if (res.data.results) {
          setScores(res.data.results);
          setScoreLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }, [symbol, submit]);

  return (
    <Paper
      sx={{ p: '2px', display: 'flex', alignItems: 'center', height: '50px' }}
      style={{ background: '#2a2e39', width: '100%', position: 'relative' }}
    >
      {scoreLoading ? (
        <CircularProgress style={{ position: 'absolute', left: '45%' }} />
      ) : (
        <div
          style={{
            width: '100%',
            minWidth: '460px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px'
          }}
        >
          <div>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>Daily Performance Score:</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>Monday</Typography>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>{scores[0] === 0 ? 'NS' : scores[0]}</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>Tuesday</Typography>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>{scores[1] === 0 ? 'NS' : scores[1]}</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>Wednesday</Typography>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>{scores[2] === 0 ? 'NS' : scores[2]}</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>Thursday</Typography>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>{scores[3] === 0 ? 'NS' : scores[3]}</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: '30px' }}>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>Friday</Typography>
            <Typography style={{ color: ' #d1d4dc', fontWeight: 'bold' }}>{scores[4] === 0 ? 'NS' : scores[4]}</Typography>
          </div>
        </div>
      )}
    </Paper>
  );
}

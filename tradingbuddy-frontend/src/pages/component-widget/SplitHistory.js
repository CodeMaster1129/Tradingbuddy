/* eslint-disable */
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { Box, IconButton, Button, InputBase, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SpliteHistory = () => {
  const [data, setData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');

  useEffect(() => {
    getData();
  }, []);
  const keyPress = async (e) => {
    if (e.keyCode === 13) {
      getData();
    }
  };

  const getData = async () => {
    try {
      const response = await fetch(`https://eodhd.com/api/splits/${symbol}.US?fmt=json&from=2000-01-01&&api_token=653ab15bd64429.39680735`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching splits data:', error);
    }
  };

  const onClickSearchItem = () => {
    getData();
  };

  data.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  const simplifiedFraction = (decimalString) => {
    const decimalParts = decimalString.split('/');

    const numerator = parseFloat(decimalParts[0]);
    const denominator = parseFloat(decimalParts[1]);

    const simplifiedFraction = `${numerator}/${denominator}`;

    return simplifiedFraction;
  };

  return (
    <div className="tradingview-widget-container" style={{ height: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: '100%' }}>
        <Box sx={{ borderBottom: '1px solid', marginLeft: '30px', marginRight: '30px' }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="baseline" spacing={2}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={2}
              sx={{ alignItems: 'center', paddingTop: '15px', paddingBottom: '10px' }}
            >
              <Paper
                sx={{ p: '2px', display: 'flex', alignItems: 'center', width: 200 }}
                style={{ marginRight: '10px', background: '#2a2e39' }}
                onChange={(e) => {
                  setSymbol(e.target.value);
                }}
                onKeyDown={keyPress}
              >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="Symbol">
                  <SearchIcon style={{ color: '#d1d4dc' }} />
                </IconButton>
                <InputBase sx={{ ml: 1, flex: 1 }} placeholder="AAPL" style={{ color: '#d1d4dc' }} />
              </Paper>
              <Button variant="contained" style={{ marginRight: '10px', background: '#2962ff' }} onClick={() => onClickSearchItem()}>
                Submit
              </Button>
            </Stack>
          </Stack>
        </Box>
        <TableContainer component={Paper} sx={{ background: '#1e222d' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ background: '#FFFFFF19' }}>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  No
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  Date
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  Ratio
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" scope="row" sx={{ color: '#D1D4DC' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    {row.date}
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    {simplifiedFraction(row.split)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SpliteHistory;

/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, IconButton, Button, InputBase, Stack, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';

const FxBotBuddyResults = () => {
  const [accountData, setAccountData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [vwFxBotBuddyResultsGold, setVwFxBotBuddyResultsGold] = useState([]);
  const [vwFxBotBuddyResultsForex, setVwFxBotBuddyResultsForex] = useState([]);
  // const [vwFxBotBuddyResultsOil, setVwFxBotBuddyResultsOil] = useState([]);

  useEffect(() => {
    const getTradersConnectData = async () => {
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/activity/getTradersConnectData`,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          if (res.status === 200) {
            setAccountData(res.data.data);
          }
        })
        .catch((res) => {
          toast.error(res.message);
        });
    };
    const getvwFxBotBuddyResultsForex = async () => {
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/activity/getvwFxBotBuddyResultsForex`,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          if (res.status === 200) setVwFxBotBuddyResultsForex(res.data.data);
        })
        .catch((res) => {
          toast.error(res.message);
        });
    };
    const getvwFxBotBuddyResultsGold = async () => {
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/activity/getvwFxBotBuddyResultsGold`,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          if (res.status === 200) setVwFxBotBuddyResultsGold(res.data.data);
        })
        .catch((res) => {
          toast.error(res.message);
        });
    };
    // const getvwFxBotBuddyResultsOil = async () => {
    //   await axios({
    //     method: 'get',
    //     url: `${process.env.REACT_APP_API_URL}/activity/getvwFxBotBuddyResultsOil`,
    //     headers: { 'Content-Type': 'multipart/form-data' }
    //   })
    //     .then((res) => {
    //       if (res.status === 200) setVwFxBotBuddyResultsOil(res.data.data);
    //     })
    //     .catch((res) => {
    //       toast.error(res.message);
    //     });
    // };
    getTradersConnectData();
    getvwFxBotBuddyResultsForex();
    getvwFxBotBuddyResultsGold();
    // getvwFxBotBuddyResultsOil();
  }, []);

  const keyPress = async (e) => {
    if (e.keyCode === 13) {
      var bodyFormData = new FormData();
      bodyFormData.append('account', searchValue);
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/activity/getTraderConnect_account`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          setAccountData(res.data);
        })
        .catch((res) => {
          toast.error(res.message);
        });
    }
  };

  const onClickSearchItem = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('account', searchValue);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/activity/getTraderConnect_account`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        setAccountData(res.data);
      })
      .catch((res) => {
        toast.error(res.message);
      });
  };

  return (
    <Box sx={{ p: '10px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={2}>
        <Box sx={{ color: '#d1d4dc', fontSize: '25px', paddingLeft: '20px' }}>BOTS</Box>
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
                  setSearchValue(e.target.value);
                }}
                onKeyDown={keyPress}
              >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="Symbol">
                  <SearchIcon style={{ color: '#d1d4dc' }} />
                </IconButton>
                <InputBase sx={{ ml: 1, flex: 1 }} placeholder="ACCOUNT" style={{ color: '#d1d4dc' }} />
              </Paper>
              <Button variant="contained" style={{ marginRight: '10px', background: '#2962ff' }} onClick={() => onClickSearchItem()}>
                Submit
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <TableContainer component={Paper} sx={{ background: '#1e222d' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ background: '#FFFFFF19' }}>
              <TableCell sx={{ color: '#D1D4DC' }}>STATUS</TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                ACCOUNT
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                BALANCE
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                EQUITY
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                OPEN TRADES
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                OPEN(P/L)
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                DAY(P/L)
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                WEEK(P/L)
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                MONTHLY(P/L)
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                TOTAL(P/L)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vwFxBotBuddyResultsForex?.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ color: '#D1D4DC' }}>
                  {row['STATUS']}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row['ACCOUNT']}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row['BALANCE'].toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  ${row['EQUITY'].toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row['OPEN TRADES']}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}></TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row['DayPL']}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row['WeekPL'].toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row['MonthPL'].toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row['TOTALPL'].toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {vwFxBotBuddyResultsGold?.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ color: '#D1D4DC' }}>
                  {row[0]}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[1]}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[2]}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  ${row[3].toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[4]}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}></TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[5]}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[6].toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[7].toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[8].toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {/* {vwFxBotBuddyResultsOil?.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ color: '#D1D4DC' }}>
                  {row[0]}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[1]}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[2]}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  ${row[3].toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[4]}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}></TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[5]}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[6].toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[7].toFixed(2)}
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  {row[8].toFixed(2)}
                </TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ color: '#d1d4dc', fontSize: '25px', paddingLeft: '20px', paddingTop: '10px', paddingButtom: '10px' }}>BUDDY ACCOUNTS</Box>
      <TableContainer component={Paper} sx={{ background: '#1e222d' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ background: '#FFFFFF19' }}>
              <TableCell sx={{ color: '#D1D4DC' }}>STATUS</TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                ACCOUNT
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                BALANCE
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                EQUITY
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                OPEN TRADES
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                OPEN(P/L)
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                DAY(P/L)
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                WEEK(P/L)
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                MONTHLY(P/L)
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                TOTAL(P/L)
              </TableCell>
              <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                Bot Factor
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountData?.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ color: '#D1D4DC' }}>
                  <Typography>{row['Status']}</Typography>
                  <Typography sx={{ color: 'red' }}>Pairs:</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  <Typography>{row['Account']}</Typography>
                  <Typography sx={{ color: 'green' }}>{row['forexSymbol01']}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  <Typography>{row['Balance']}</Typography>
                  <Typography sx={{ color: 'green' }}>{row['forexSymbol02']}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  <Typography>{row['Equity']}</Typography>
                  <Typography sx={{ color: 'green' }}>{row['forexSymbol03']}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  <Typography>{row['OpenTrades']}</Typography>
                  <Typography sx={{ color: 'green' }}>{row['forexSymbol04']}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  <Typography>{row['OpenPL']}</Typography>
                  <Typography sx={{ color: 'green' }}>{row['forexSymbol05']}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  <Typography>{row['DayPL']}</Typography>
                  <Typography sx={{ color: 'green' }}>{row['forexSymbol06']}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  <Typography>{row['WeekPL']}</Typography>
                  <Typography sx={{ color: 'green' }}>{row['forexSymbol07']}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  <Typography> {row['MonthlyPL']}</Typography>
                  <Typography sx={{ color: 'green' }}>{row['forexSymbol08']}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  <Typography> {row['TotalPL']}</Typography>
                  <Typography sx={{ color: 'green' }}>{row['forexSymbol09']}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                  <Typography> {row['RiskSetting']}</Typography>
                  <Typography sx={{ color: 'green' }}>{row['forexSymbol010']}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FxBotBuddyResults;
/* eslint-disable */

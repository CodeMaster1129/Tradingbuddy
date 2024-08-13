/* eslint-disable */
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useState, useEffect } from 'react';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Button, InputBase, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const TablePaginationActions = (props) => {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page" sx={{ color: '#D1D4DC' }}>
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page" sx={{ color: '#D1D4DC' }}>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        sx={{ color: '#D1D4DC' }}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        sx={{ color: '#D1D4DC' }}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

function InsiderActivity() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [symbol, setSymbol] = useState('TSLA');
  const [from, setFrom] = useState(0);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const onClickSearchItem = async () => {
    await getData();
  };

  const keyPress = async (e) => {
    if (e.keyCode === 13) {
      getData();
    }
  };

  useEffect(() => {
    if ((page + 1) * rowsPerPage > data.length) {
      getData();
    }
  }, [page]);

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }; // number formatting

  const getData = async () => {
    try {
      let res = await axios.post(
        process.env.REACT_APP_API_ENDPOINT,
        {
          query: {
            query_string: {
              query: `issuer.tradingSymbol:${symbol}`
            }
          },
          from: from === 0 ? 0 : from * 30 + 1,
          size: 30,
          sort: [{ filedAt: { order: 'desc' } }]
        },
        {
          headers: {
            'content-type': 'application/json',
            Authorization: process.env.REACT_APP_API_KEY
          }
        }
      );
      var resData = res.data.transactions;
      let showData = [];
      resData.map((item) => {
        let base = {
          periodOfReport: item.periodOfReport,
          issuerCik: item.issuer.cik,
          issuerTicker: item.issuer.tradingSymbol,
          reportingPerson: item.reportingOwner.name,
          officerTitle: item.reportingOwner.relationship.officerTitle ? item.reportingOwner.relationship.officerTitle : ''
        };
        if (item.nonDerivativeTable) {
          if (item.nonDerivativeTable.transactions)
            item.nonDerivativeTable.transactions.map((transaction) => {
              let entry = {
                securityTitle: transaction.securityTitle,
                codingCode: transaction.coding.code,
                acquiredDisposed: transaction.amounts.acquiredDisposedCode,
                shares: transaction.amounts.shares,
                sharePrice: transaction.amounts.pricePerShare,
                total: Math.ceil(transaction.amounts.shares * transaction.amounts.pricePerShare),
                sharesOwnedFollowingTransaction: transaction.postTransactionAmounts.sharesOwnedFollowingTransaction,
                base: base
              };

              showData.push(entry);
            });
        }
      });
      if (showData?.length) setData([...showData]);
      setFrom(from + 1);
    } catch (e) {
      console.log('error', e);
    }
  };
  return (
    <div className="tradingview-widget-container" style={{ height: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ height: '100%' }}>
        <Box sx={{ marginLeft: '30px', marginRight: '30px' }}>
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
                  setSymbol(e.target.value.toUpperCase());
                }}
                onKeyDown={keyPress}
              >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="Symbol">
                  <SearchIcon style={{ color: '#d1d4dc' }} />
                </IconButton>
                <InputBase sx={{ ml: 1, flex: 1 }} placeholder="TSLA" style={{ color: '#d1d4dc' }} />
              </Paper>
              <Button variant="contained" style={{ marginRight: '10px', background: '#2962ff' }} onClick={onClickSearchItem}>
                Submit
              </Button>
            </Stack>
          </Stack>
        </Box>
        <TableContainer component={Paper} sx={{ marginTop: '10px', background: '#1e222d' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ background: '#FFFFFF19' }}>
                <TableCell align="center" style={{ width: '8%' }} sx={{ color: '#D1D4DC' }}>
                  Period Of Report
                </TableCell>
                <TableCell align="center" style={{ width: '7%' }} sx={{ color: '#D1D4DC' }}>
                  Issuer Cik
                </TableCell>
                <TableCell align="center" style={{ width: '8%' }} sx={{ color: '#D1D4DC' }}>
                  Issuer Ticker
                </TableCell>
                <TableCell align="center" style={{ width: '13%' }} sx={{ color: '#D1D4DC' }}>
                  Reporting Person
                </TableCell>
                <TableCell align="center" style={{ width: '10%' }} sx={{ color: '#D1D4DC' }}>
                  Officer Titel
                </TableCell>
                <TableCell align="center" style={{ width: '16%' }} sx={{ color: '#D1D4DC' }}>
                  Security Title
                </TableCell>
                <TableCell align="center" style={{ width: '5%' }} sx={{ color: '#D1D4DC' }}>
                  Coding Code
                </TableCell>
                <TableCell align="center" style={{ width: '8%' }} sx={{ color: '#D1D4DC' }}>
                  Shares
                </TableCell>
                <TableCell align="center" style={{ width: '8%' }} sx={{ color: '#D1D4DC' }}>
                  Share Price
                </TableCell>
                <TableCell align="center" style={{ width: '7%' }} sx={{ color: '#D1D4DC' }}>
                  Total
                </TableCell>
                <TableCell align="center" style={{ width: '10%' }} sx={{ color: '#D1D4DC' }}>
                  Shares Owned Following Transaction
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data).map((row, key) => (
                <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" style={{ width: '8%' }} sx={{ color: '#D1D4DC' }}>
                    {row.base.periodOfReport}
                  </TableCell>
                  <TableCell align="center" style={{ width: '7%' }} sx={{ color: '#D1D4DC' }}>
                    {row.base.issuerCik}
                  </TableCell>
                  <TableCell align="center" style={{ width: '8%' }} sx={{ color: '#D1D4DC' }}>
                    {row.base.issuerTicker}
                  </TableCell>
                  <TableCell align="center" style={{ width: '13%' }} sx={{ color: '#D1D4DC' }}>
                    {row.base.reportingPerson}
                  </TableCell>
                  <TableCell align="center" style={{ width: '10%' }} sx={{ color: '#D1D4DC' }}>
                    {row.base.officerTitle}
                  </TableCell>
                  <TableCell align="center" style={{ width: '16%' }} sx={{ color: '#D1D4DC' }}>
                    {row.securityTitle}
                  </TableCell>
                  <TableCell align="center" style={{ width: '5%' }} sx={{ color: '#D1D4DC' }}>
                    {row.codingCode}
                  </TableCell>
                  <TableCell align="center" style={{ width: '8%' }} sx={{ color: '#D1D4DC' }}>
                    {numberWithCommas(row.shares)}
                  </TableCell>
                  <TableCell align="center" style={{ width: '8%' }} sx={{ color: '#D1D4DC' }}>
                    {'$' + numberWithCommas(row.sharePrice)}
                  </TableCell>
                  <TableCell align="center" style={{ width: '7%' }} sx={{ color: '#D1D4DC' }}>
                    {'$' + numberWithCommas(row.total)}
                  </TableCell>
                  <TableCell align="center" style={{ width: '10%' }} sx={{ color: '#D1D4DC' }}>
                    {numberWithCommas(row.sharesOwnedFollowingTransaction)}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={10}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page'
                    },
                    native: true
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  sx={{ color: '#D1D4DC', borderBottom: 'none' }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '20px',
            // color: 'white',
            fontSize: '12px',
            marginLeft: '10px'
          }}
        >
          <div style={{ width: '37%' }}>
            <div style={{ width: '100%', height: '130px' }}>
              <div style={{ marginTop: '10px', fontSize: '14px', color: 'teal' }}>General Transaction Codes</div>
              <div style={{ marginTop: '10px', color: 'lightgray' }}>
                P - Open market or private purchase of non-derivative or derivative security
              </div>
              <div style={{ color: 'lightgray' }}>S - Open market or private sale of non-derivative or derivative security</div>
              <div style={{ color: 'lightgray' }}>V - Transaction voluntarily reported earlier than required</div>
            </div>
            <div style={{ width: '100%', height: '130px' }}>
              <div style={{ marginTop: '10px', fontSize: '14px', color: 'teal' }}>
                Derivative Securities Codes (Except for transactions exempted pursuant to Rule 16b-3)
              </div>
              <div style={{ marginTop: '10px', color: 'lightgray' }}>C - Conversion of derivative security</div>
              <div style={{ color: 'lightgray' }}>E - Expiration of short derivative position</div>
              <div style={{ color: 'lightgray' }}>H - Expiration (or cancellation) of long derivative position with value received</div>
              <div style={{ color: 'lightgray' }}>O - Exercise of out-of-the-money derivative security</div>
              <div style={{ color: 'lightgray' }}>X - Exercise of in-the-money or at-the-money derivative security</div>
            </div>
            <div style={{ width: '100%', height: '130px' }}>
              <div style={{ marginTop: '10px', fontSize: '14px', color: 'teal' }}>Other Transaction Codes</div>
              <div style={{ marginTop: '10px', color: 'lightgray' }}>J - Other acquisition or disposition (describe transaction)</div>
              <div style={{ color: 'lightgray' }}>K - Transaction in equity swap or instrument with similar characteristics</div>
              <div style={{ color: 'lightgray' }}>U - Disposition pursuant to a tender of shares in a change of control transaction</div>
            </div>
          </div>
          <div style={{ width: '63%' }}>
            <div style={{ width: '100%', height: '130px' }}>
              <div style={{ marginTop: '10px', fontSize: '14px', color: 'teal' }}>Rule 16b-3 Transaction Codes</div>
              <div style={{ marginTop: '10px', color: 'lightgray' }}>A - Grant, award or other acquisition pursuant to Rule 16b-3(d)</div>
              <div style={{ color: 'lightgray' }}>D - Disposition to the issuer of issuer equity securities pursuant to Rule 16b-3(e)</div>
              <div style={{ color: 'lightgray' }}>
                F - Payment of exercise price or tax liability by delivering or withholding securities incident to the receipt, exercise or
                vesting of a security issued in accordance with Rule 16b-3
              </div>
              <div style={{ color: 'lightgray' }}>
                I - Discretionary transaction in accordance with Rule 16b-3(f) resulting in acquisition or disposition of issuer securities
              </div>
              <div style={{ color: 'lightgray' }}>M - Exercise or conversion of derivative security exempted pursuant to Rule 16b-3</div>
            </div>
            <div style={{ width: '100%', height: '130px' }}>
              <div style={{ marginTop: '10px', fontSize: '14px', color: 'teal' }}>
                Other Section 16(b) Exempt Transaction and Small Acquisition Codes (except for Rule 16b-3 codes above)
              </div>
              <div style={{ marginTop: '10px', color: 'lightgray' }}>G - Bona fide gift</div>
              <div style={{ color: 'lightgray' }}>L - Small acquisition under Rule 16a-6</div>
              <div style={{ color: 'lightgray' }}>W - Acquisition or disposition by will or the laws of descent and distribution</div>
              <div style={{ color: 'lightgray' }}>Z - Deposit into or withdrawal from voting trust</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsiderActivity;

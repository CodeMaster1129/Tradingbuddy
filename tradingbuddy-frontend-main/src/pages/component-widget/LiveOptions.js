/* eslint-disable */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, IconButton, Button, InputBase, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import TableFooter from '@mui/material/TableFooter';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

function TablePaginationActions(props) {
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
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

const LiveOptions = () => {
  const [liveOptionsData, setLiveOptionsData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [onLoading, setOnLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - liveOptionsData.length) : 0;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if ((page + 1) * rowsPerPage > liveOptionsData.length) {
      const getLiveOptionsData = async () => {
        await axios({
          method: 'get',
          url: `${process.env.REACT_APP_API_URL}/activity/getLiveOptionData`,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then((res) => {
            if (res.status === 200) setLiveOptionsData(res.data.data);
            setOnLoading(false);
          })
          .catch((res) => {
            toast.error(res.message);
            setOnLoading(false);
          });
      };
      getLiveOptionsData();
    }
  }, [page]);

  const keyPress = async (e) => {
    if (e.keyCode === 13) {
      var bodyFormData = new FormData();
      bodyFormData.append('symbol', searchValue);
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/activity/getLiveOptions_symbol`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          setLiveOptionsData(res.data);
        })
        .catch((res) => {
          toast.error(res.message);
        });
    }
  };

  const onClickSearchItem = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('symbol', searchValue);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/activity/getLiveOptions_symbol`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        setLiveOptionsData(res.data);
      })
      .catch((res) => {
        toast.error(res.message);
      });
  };

  const compareTime = (a, b) => {
    const timeA = new Date(a[0]);
    const timeB = new Date(b[0]);
    return timeB - timeA;
  };

  // Sort the array using the comparison function
  const sortedArray = liveOptionsData.sort(compareTime);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%' }}>
      {onLoading ? (
        <Backdrop sx={{ zIndex: 999 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
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
                    setSearchValue(e.target.value);
                  }}
                  onKeyDown={keyPress}
                >
                  <IconButton type="button" sx={{ p: '10px' }} aria-label="Symbol">
                    <SearchIcon style={{ color: '#d1d4dc' }} />
                  </IconButton>
                  <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Symbol" style={{ color: '#d1d4dc' }} />
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
                  <TableCell sx={{ color: '#D1D4DC' }}>Date Time</TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    Ticker
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    Expiry Date
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    Strike
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    Option Type
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    Spot
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    Bid
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    Details
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    Ask
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    OrderType
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                    Premium
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0 ? sortedArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : sortedArray).map(
                  (row, key) => (
                    <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                        {row[3]}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                        {row[4]}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                        {row[5]}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                        {row[6]}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                        {row[7]}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                        {row[8]}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                        {row[9]}
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#D1D4DC' }}>
                        {row[10]}
                      </TableCell>
                    </TableRow>
                  )
                )}
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
                    count={sortedArray.length}
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
        </div>
      )}
    </div>
  );
};

export default LiveOptions;
/* eslint-disable */

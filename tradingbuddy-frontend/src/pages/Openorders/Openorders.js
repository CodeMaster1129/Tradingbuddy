/* eslint-disable */
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, useCallback } from 'react';
import axios from '../../../node_modules/axios/index';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  TextField,
  MenuItem,
  Slider,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput
} from '@mui/material';

// third-party
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import update from 'immutability-helper';

import { DndProvider } from 'react-dnd';
import { isMobile } from 'react-device-detect';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { NumericFormat } from 'react-number-format';

import {
  useColumnOrder,
  useExpanded,
  useFilters,
  useGroupBy,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable
} from 'react-table';

// project import
import MainCard from 'components/MainCard';
import Avatar from './Avatar';
import ScrollX from './ScrollX';
import LinearWithLabel from './LinearWithLabel';

import {
  DraggableHeader,
  HidingSelect,
  HeaderSort,
  IndeterminateCheckbox,
  TablePagination,
  TableRowSelection,
  CSVExport,
  EmptyTable
} from './ReactTable';
import {
  roundedMedian,
  renderFilterTypes,
  filterGreaterThan,
  DefaultColumnFilter,
  SelectColumnFilter,
  SliderColumnFilter,
  NumberRangeColumnFilter
} from './react-table';
import { useAsyncDebounce } from 'react-table';
// assets
import { DownOutlined, EditTwoTone, GroupOutlined, RightOutlined, SendOutlined, SearchOutlined, UngroupOutlined } from '@ant-design/icons';

const avatarImage = require.context('assets/images/users', true);

const EditableRow = ({ value: initialValue, row: { index }, column: { id, dataType }, editableRowIndex }) => {
  const [value, setValue] = useState(initialValue);
  const theme = useTheme();
  const onChange = (e) => {
    e.stopPropagation();
    setValue(e.target.value);
  };

  const ShowStatus = (value) => {
    switch (value) {
      case 'Complicated':
        return <Chip color="error" label="Complicated" size="small" variant="light" />;
      case 'Relationship':
        return <Chip color="success" label="Relationship" size="small" variant="light" />;
      case 'Single':
      default:
        return <Chip color="info" label="Single" size="small" variant="light" />;
    }
  };

  let element;
  let userInfoSchema;

  switch (id) {
    case 'email':
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.string().email('Enter valid email ').required('Email is a required field')
      });
      break;
    case 'age':
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.number()
          .required('Age is required')
          .typeError('Age must be number')
          .min(18, 'You must be at least 18 years')
          .max(100, 'You must be at most 60 years')
      });
      break;
    case 'visits':
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.number().typeError('Visits must be number').required('Required')
      });
      break;
    default:
      userInfoSchema = Yup.object().shape({
        userInfo: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is Required')
      });
      break;
  }
  let IsEditAble = index === editableRowIndex;

  switch (dataType) {
    case 'text':
      element = (
        <>
          {IsEditAble ? (
            <>
              <Formik
                initialValues={{
                  userInfo: value
                }}
                enableReinitialize
                validationSchema={userInfoSchema}
                onSubmit={() => {}}
              >
                {({ values, handleChange, handleBlur, errors, touched }) => (
                  <Form>
                    <TextField
                      value={values.userInfo}
                      id={`${index}-${id}`}
                      name="userInfo"
                      onChange={(e) => {
                        handleChange(e);
                        onChange(e);
                      }}
                      onBlur={handleBlur}
                      error={touched.userInfo && Boolean(errors.userInfo)}
                      helperText={touched.userInfo && errors.userInfo && errors.userInfo}
                      sx={{
                        '& .MuiOutlinedInput-input': {
                          py: 0.75,
                          px: 1,
                          backgroundColor: theme.palette.mode === 'inherit'
                        }
                      }}
                    />
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            value
          )}
        </>
      );
      break;
    case 'select':
      element = (
        <>
          {IsEditAble ? (
            <Select
              labelId="demo-simple-select-label"
              sx={{
                '& .MuiOutlinedInput-input': {
                  py: 0.75,
                  px: 1,
                  backgroundColor: theme.palette.mode === 'inherit'
                }
              }}
              id="demo-simple-select"
              value={value}
              onChange={onChange}
            >
              <MenuItem value={'Complicated'}>
                <Chip color="error" label="Complicated" size="small" variant="light" />
              </MenuItem>
              <MenuItem value={'Relationship'}>
                <Chip color="success" label="Relationship" size="small" variant="light" />
              </MenuItem>
              <MenuItem value={'Single'}>
                <Chip color="info" label="Single" size="small" variant="light" />
              </MenuItem>
            </Select>
          ) : (
            ShowStatus(value)
          )}
        </>
      );
      break;
    case 'progress':
      element = (
        <>
          {IsEditAble ? (
            <>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1, minWidth: 120 }}>
                <Slider
                  value={value}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  valueLabelDisplay="auto"
                  aria-labelledby="non-linear-slider"
                />
              </Stack>
            </>
          ) : (
            <div>
              <LinearWithLabel value={value} sx={{ minWidth: 75 }} />
            </div>
          )}
        </>
      );
      break;
    default:
      element = <span>{value}</span>;
      break;
  }
  return element;
};

export function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, ...other }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <OutlinedInput
      value={value || ''}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`Search ${count} records...`}
      id="start-adornment-email"
      startAdornment={<SearchOutlined />}
      {...other}
    />
  );
}

GlobalFilter.propTypes = {
  preGlobalFilteredRows: PropTypes.array,
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func
};
// ==============================|| REACT TABLE ||============================== //

const ColumnCell = ({ row, setEditableRowIndex, editableRowIndex }) => (
  <>
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
      <Tooltip title={editableRowIndex !== row.index ? 'Edit' : 'Save'}>
        <IconButton
          color={editableRowIndex !== row.index ? 'primary' : 'success'}
          onClick={(e) => {
            e.stopPropagation();
            const currentIndex = row.index;
            if (editableRowIndex !== currentIndex) {
              // row requested for edit access
              setEditableRowIndex(currentIndex);
            } else {
              // request for saving the updated row
              setEditableRowIndex(null);
            }
          }}
        >
          {editableRowIndex !== row.index ? <EditTwoTone /> : <SendOutlined />}
        </IconButton>
      </Tooltip>
    </Stack>
  </>
);

ColumnCell.propTypes = {
  row: PropTypes.object,
  setEditableRowIndex: PropTypes.func,
  editableRowIndex: PropTypes.number
};

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| REACT TABLE - UMBRELLA ||============================== //

const CellAvatar = ({ value }) => <Avatar alt="Avatar 1" size="sm" src={avatarImage(`./avatar-${!value ? 1 : value}.png`)} />;

CellAvatar.propTypes = {
  value: PropTypes.number
};

function ReactTable(props) {
  const { columns, data } = props;
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState(0);
  const filterTypes = useMemo(() => renderFilterTypes, []);
  const [editableRowIndex, setEditableRowIndex] = useState(null);
  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter, Cell: EditableRow }), []);

  const initialState = useMemo(() => {
    if (selectedItem === 0) {
      return {
        filters: [{ id: 'status', value: '' }],
        hiddenColumns: [],
        columnOrder: [
          'AcctID',
          'AcctName',
          'AcctType',
          'Platform',
          'OrderID',
          'OrderStatus',
          'OrderType',
          'EntryType',
          'Symbol',
          'OrderDateTime',
          'Price',
          'Qty',
          'TP',
          'Profit'
        ],
        pageIndex: 0,
        pageSize: 5
      };
    } else if (selectedItem === 1) {
      return {
        filters: [{ id: 'status', value: '' }],
        hiddenColumns: [],
        columnOrder: [
          'AcctID',
          'AcctName',
          'AcctType',
          'EntryType',
          'OrderDateTime',
          'OrderID',
          'OrderStatus',
          'OrderType',
          'Symbol',
          'Platform',
          'Price',
          'Profit',
          'Qty',
          'TP'
        ],
        pageIndex: 0,
        pageSize: 5
      };
    } else if (selectedItem === 2) {
      return {
        filters: [{ id: 'status', value: '' }],
        hiddenColumns: [],
        columnOrder: [
          'AcctID',
          'AcctName',
          'AcctType',
          'platform',
          'AcctLeverage',
          'LeveragePercent',
          'Symbol',
          'Status',
          'FirstOrderID',
          'ActionType',
          'OpenEntryType',
          'FirstOpenDateTime',
          'LastOrderID',
          'ClosedType',
          'ClosedEntryType',
          'ClosedDateTime',
          'TotalLegs',
          'LegType',
          'TotalOrders',
          'TotalPositions',
          'TotalLots',
          'AvgEntryPrice',
          'SL',
          'TP',
          'AvgClosedPrice',
          'TotalCommission',
          'TotalSwap',
          'TotalProfit',
          'TotalUnits',
          'TotalCurreny',
          'MarginRequired',
          'Duration'
        ],
        pageIndex: 0,
        pageSize: 5
      };
    } else if (selectedItem === 3) {
      return {
        filters: [{ id: 'status', value: '' }],
        hiddenColumns: [],
        columnOrder: [
          'AcctID',
          'AcctName',
          'AcctType',
          'Platform',
          'AcctLeverage',
          'LeveragePercent',
          'Symbol',
          'Status',
          'FirstOrderID',
          'ActionType',
          'OpenEntryType',
          'FirstOpenDateTime',
          'LastOrderID',
          'ClosedType',
          'ClosedEntryType',
          'ClosedDateTime',
          'TotalLegs',
          'LegType',
          'TotalOrders',
          'TotalPositions',
          'TotalLots',
          'AvgEntryPrice',
          'SL',
          'TP',
          'AvgClosedPrice',
          'TotalCommission',
          'TotalSwap',
          'TotalProfit',
          'TotalPips',
          'PipValue',
          'TotalUnits',
          'TotalCurrency',
          'MarginRequired',
          'Duration',
          'yearFirstLegOpened',
          'monthFirstLegOpened',
          'weekFirstLegOpened',
          'dayofmonthFirstLegOpened',
          'weekdayFirstLegOpened',
          'hourFirstLegOpened'
        ],
        pageIndex: 0,
        pageSize: 5
      };
    }
  }, [selectedItem]);

  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
  };

  useEffect(() => {
    props.onchange(selectedItem);
  }, [selectedItem]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    page,
    prepareRow,
    setColumnOrder,
    gotoPage,
    setPageSize,
    setHiddenColumns,
    allColumns,
    state: { globalFilter, hiddenColumns, pageIndex, pageSize, columnOrder, selectedRowIds },
    preGlobalFilteredRows,
    setGlobalFilter,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState,
      filterTypes,
      editableRowIndex,
      setEditableRowIndex,
      selectedItem
    },
    useGlobalFilter,
    useFilters,
    useColumnOrder,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const reorder = (item, newIndex) => {
    const { index: currentIndex } = item;

    let dragRecord = columnOrder[currentIndex];
    if (!columnOrder.includes(item.id)) {
      dragRecord = item.id;
    }

    setColumnOrder(
      update(columnOrder, {
        $splice: [
          [currentIndex, 1],
          [newIndex, 0, dragRecord]
        ]
      })
    );
  };

  let headers = [];
  allColumns.map((item) => {
    if (!hiddenColumns?.includes(item.id) && item.id !== 'selection' && item.id !== 'edit') {
      headers.push({ label: typeof item.Header === 'string' ? item.Header : '#', key: item.id });
    }
    return item;
  });

  return (
    <>
      <TableRowSelection selected={Object.keys(selectedRowIds).length} />
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" sx={{ p: 2, pb: 0 }}>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          />
          <Stack direction="row" spacing={2}>
            <HidingSelect hiddenColumns={hiddenColumns} setHiddenColumns={setHiddenColumns} allColumns={allColumns} />
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel id="demo-simple-select-label">Select table</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                placeholder="Multi "
                value={selectedItem}
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>Open Orders - Detail</MenuItem>
                <MenuItem value={1}>Closed Orders - Detail</MenuItem>
                <MenuItem value={2}>Open Orders - Summary</MenuItem>
                <MenuItem value={3}>Closed Orders - Summary</MenuItem>
              </Select>
            </FormControl>
            <CSVExport
              data={selectedFlatRows.length > 0 ? selectedFlatRows.map((d) => d.original).filter((d) => d !== undefined) : data}
              filename={'umbrella-table.csv'}
              headers={headers}
            />
          </Stack>
        </Stack>

        <Box sx={{ width: '100%', overflowX: 'auto', display: 'block' }}>
          <Table {...getTableProps()}>
            <TableHead sx={{ borderTopWidth: 2 }}>
              {headerGroups.map((headerGroup, i) => (
                <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => {
                    const groupIcon = column.isGrouped ? <UngroupOutlined /> : <GroupOutlined />;
                    return (
                      <TableCell key={`umbrella-header-cell-${index}`} {...column.getHeaderProps([{ className: column.className }])}>
                        <DraggableHeader reorder={reorder} key={column.id} column={column} index={index}>
                          <Stack direction="row" spacing={1.15} alignItems="center" sx={{ display: 'inline-flex' }}>
                            {column.canGroupBy ? (
                              <Box
                                sx={{
                                  color: column.isGrouped ? 'error.main' : 'primary.main',
                                  fontSize: '1rem'
                                }}
                                {...column.getGroupByToggleProps()}
                              >
                                {groupIcon}
                              </Box>
                            ) : null}
                            <HeaderSort column={column} sort />
                          </Stack>
                        </DraggableHeader>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>

            {/* striped table -> add class 'striped' */}
            <TableBody {...getTableBodyProps()} className="striped">
              {headerGroups.map((group, i) => (
                <TableRow key={i} {...group.getHeaderGroupProps()}>
                  {group.headers.map((column, index) => (
                    <TableCell key={index} {...column.getHeaderProps([{ className: column.className }])}>
                      {column.canFilter ? column.render('Filter') : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {page.length > 0 ? (
                page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <TableRow
                      key={i}
                      {...row.getRowProps()}
                      {...(editableRowIndex !== row.index && {
                        onClick: () => {
                          row.toggleRowSelected();
                        }
                      })}
                      sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                    >
                      {row.cells.map((cell, index) => {
                        let bgcolor = 'inherit';
                        if (cell.isGrouped) bgcolor = 'success.lighter';
                        if (cell.isAggregated) bgcolor = 'warning.lighter';
                        if (cell.isPlaceholder) bgcolor = 'error.lighter';
                        if (cell.isPlaceholder) bgcolor = 'error.lighter';
                        if (row.isSelected) bgcolor = alpha(theme.palette.primary.lighter, 0.35);
                        const collapseIcon = row.isExpanded ? <DownOutlined /> : <RightOutlined />;

                        return (
                          <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])} sx={{ bgcolor }}>
                            {cell.isGrouped ? (
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ display: 'inline-flex' }}>
                                <Box
                                  sx={{ pr: 1.25, fontSize: '0.75rem', color: 'text.secondary' }}
                                  onClick={(e) => {
                                    row.toggleRowExpanded();
                                    e.stopPropagation();
                                  }}
                                >
                                  {collapseIcon}
                                </Box>
                                {cell.render('Cell')} ({row.subRows.length})
                              </Stack>
                            ) : cell.isAggregated ? (
                              cell.render('Aggregated')
                            ) : cell.isPlaceholder ? null : (
                              cell.render('Cell')
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <EmptyTable msg="No Data" colSpan={9} />
              )}
            </TableBody>

            {/* footer table */}
            <TableFooter sx={{ borderBottomWidth: 2 }}>
              {footerGroups.map((group, i) => (
                <TableRow key={i} {...group.getFooterGroupProps()}>
                  {group.headers.map((column, index) => (
                    <TableCell key={index} {...column.getFooterProps([{ className: column.className }])}>
                      {column.render('Footer')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          </Table>
        </Box>
        <Box sx={{ p: 2, py: 0 }}>
          <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
        </Box>
      </Stack>
    </>
  );
}

// Section Cell and Header
const SelectionCell = ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />;
const SelectionHeader = ({ getToggleAllPageRowsSelectedProps }) => (
  <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />
);

SelectionCell.propTypes = {
  row: PropTypes.object
};

SelectionHeader.propTypes = {
  getToggleAllPageRowsSelectedProps: PropTypes.func
};

const UmbrellaTable = () => {
  // const data = useMemo(() => makeData(200), []);
  const [responseData, setResponseData] = useState([]);
  const [item, setItem] = useState(0);
  const [columns, setColumns] = useState([]);
  const handleClick = (Data) => {
    setItem(Data);
    setResponseData((preData) => []);
  };

  useEffect(() => {
    if (item === 0) {
      setColumns((preColumns) => [
        {
          Header: 'Acct ID',
          Footer: 'Acct ID',
          accessor: 'AcctID',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Acct Name',
          Footer: 'Acct Name',
          accessor: 'AcctName',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Acct Type',
          Footer: 'Acct Type',
          accessor: 'AcctType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'EntryType',
          Footer: 'EntryType',
          accessor: 'EntryType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'OrderDateTime',
          Footer: 'OrderDateTime',
          accessor: 'OrderDateTime',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'OrderID',
          Footer: 'OrderID',
          accessor: 'OrderID',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'OrderStatus',
          Footer: 'OrderStatus',
          accessor: 'OrderStatus',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'OrderType',
          Footer: 'OrderType',
          accessor: 'OrderType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Platform',
          Footer: 'Platform',
          accessor: 'Platform',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Price',
          Footer: 'Price',
          accessor: 'Price',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Profit',
          Footer: 'Profit',
          accessor: 'Profit',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Quantity',
          Footer: 'Quantity',
          accessor: 'Qty',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Symbol',
          Footer: 'Symbol',
          accessor: 'Symbol',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TP',
          Footer: 'TP',
          accessor: 'TP',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        }
      ]);

      getOpenData();
      const interval = setInterval(() => {
        getOpenData();
      }, 300000);
      return () => clearInterval(interval);
    }
    if (item === 1) {
      setColumns((preColumns) => [
        {
          Header: 'Acct ID',
          Footer: 'Acct ID',
          accessor: 'AcctID',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Acct Name',
          Footer: 'Acct Name',
          accessor: 'AcctName',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Acct Type',
          Footer: 'Acct Type',
          accessor: 'AcctType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Order ID',
          Footer: 'Order ID',
          accessor: 'OrderID',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Order Status',
          Footer: 'Order Status',
          accessor: 'OrderStatus',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Platform',
          Footer: 'Platform',
          accessor: 'Platform',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Timestamp',
          Footer: 'Timestamp',
          accessor: 'OrderDateTime',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'EntryType',
          Footer: 'EntryType',
          accessor: 'EntryType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Take Profit',
          Footer: 'Take Profit',
          accessor: 'TP',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Order Type',
          Footer: 'Order Type',
          accessor: 'OrderType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Symbol',
          Footer: 'Symbol',
          accessor: 'Symbol',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Quantity',
          Footer: 'Quantity',
          accessor: 'Qty',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Price',
          Footer: 'Price',
          accessor: 'Price',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Profit',
          Footer: 'Profit',
          accessor: 'Profit',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        }
      ]);
      getClosedData();
      const interval = setInterval(() => {
        getClosedData();
      }, 300000);
      return () => clearInterval(interval);
    }
    if (item === 2) {
      setColumns((preColumns) => [
        {
          Header: 'Acct ID',
          Footer: 'Acct ID',
          accessor: 'AcctID',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'AcctLeverage',
          Footer: 'AcctLeverage',
          accessor: 'AcctLeverage',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Acct Name',
          Footer: 'Acct Name',
          accessor: 'AcctName',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Acct Type',
          Footer: 'Acct Type',
          accessor: 'AcctType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'ActionType',
          Footer: 'ActionType',
          accessor: 'ActionType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'AvgClosedPrice',
          Footer: 'AvgClosedPrice',
          accessor: 'AvgClosedPrice',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'AvgEntryPrice',
          Footer: 'AvgEntryPrice',
          accessor: 'AvgEntryPrice',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'ClosedDateTime',
          Footer: 'ClosedDateTime',
          accessor: 'ClosedDateTime',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'ClosedEntryType',
          Footer: 'ClosedEntryType',
          accessor: 'ClosedEntryType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'ClosedType',
          Footer: 'ClosedType',
          accessor: 'ClosedType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Duration',
          Footer: 'Duration',
          accessor: 'Duration',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'FirstOpenDateTime',
          Footer: 'FirstOpenDateTime',
          accessor: 'FirstOpenDateTime',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'FirstOrderID',
          Footer: 'FirstOrderID',
          accessor: 'FirstOrderID',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'LastOrderID',
          Footer: 'LastOrderID',
          accessor: 'LastOrderID',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'LegType',
          Footer: 'LegType',
          accessor: 'LegType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'LeveragePercent',
          Footer: 'LeveragePercent',
          accessor: 'LeveragePercent',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'MarginRequired',
          Footer: 'MarginRequired',
          accessor: 'MarginRequired',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'OpenEntryType',
          Footer: 'OpenEntryType',
          accessor: 'OpenEntryType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'SL',
          Footer: 'SL',
          accessor: 'SL',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Status',
          Footer: 'Status',
          accessor: 'Status',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Symbol',
          Footer: 'Symbol',
          accessor: 'Symbol',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TP',
          Footer: 'TP',
          accessor: 'TP',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalCommission',
          Footer: 'TotalCommission',
          accessor: 'TotalCommission',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalCurreny',
          Footer: 'TotalCurreny',
          accessor: 'TotalCurreny',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalLegs',
          Footer: 'TotalLegs',
          accessor: 'TotalLegs',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalLots',
          Footer: 'TotalLots',
          accessor: 'TotalLots',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalOrders',
          Footer: 'TotalOrders',
          accessor: 'TotalOrders',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalPositions',
          Footer: 'TotalPositions',
          accessor: 'TotalPositions',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalProfit',
          Footer: 'TotalProfit',
          accessor: 'TotalProfit',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalSwap',
          Footer: 'TotalSwap',
          accessor: 'TotalSwap',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalUnits',
          Footer: 'TotalUnits',
          accessor: 'TotalUnits',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'platform',
          Footer: 'platform',
          accessor: 'platform',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        }
      ]);
      getOpenDataSummary();
      const interval = setInterval(() => {
        getOpenDataSummary();
      }, 300000);
      return () => clearInterval(interval);
    }
    if (item === 3) {
      setColumns((preColumns) => [
        {
          Header: 'Acct ID',
          Footer: 'Acct ID',
          accessor: 'AcctID',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'AcctLeverage',
          Footer: 'AcctLeverage',
          accessor: 'AcctLeverage',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Acct Name',
          Footer: 'Acct Name',
          accessor: 'AcctName',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Acct Type',
          Footer: 'Acct Type',
          accessor: 'AcctType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Action Type',
          Footer: 'Action Type',
          accessor: 'ActionType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'AvgClosedPrice',
          Footer: 'AvgClosedPrice',
          accessor: 'AvgClosedPrice',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Symbol',
          Footer: 'Symbol',
          accessor: 'Symbol',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'AvgEntryPrice',
          Footer: 'AvgEntryPrice',
          accessor: 'AvgEntryPrice',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'ClosedDateTime',
          Footer: 'ClosedDateTime',
          accessor: 'ClosedDateTime',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'ClosedEntryType',
          Footer: 'ClosedEntryType',
          accessor: 'ClosedEntryType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'ClosedType',
          Footer: 'ClosedType',
          accessor: 'ClosedType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Duration',
          Footer: 'Duration',
          accessor: 'Duration',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'FirstOpenDateTime',
          Footer: 'FirstOpenDateTime',
          accessor: 'FirstOpenDateTime',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'FirstOrderID',
          Footer: 'FirstOrderID',
          accessor: 'FirstOrderID',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'LastOrderID',
          Footer: 'LastOrderID',
          accessor: 'LastOrderID',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'LegType',
          Footer: 'LegType',
          accessor: 'LegType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'LeveragePercent',
          Footer: 'LeveragePercent',
          accessor: 'LeveragePercent',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'MarginRequired',
          Footer: 'MarginRequired',
          accessor: 'MarginRequired',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'OpenEntryType',
          Footer: 'OpenEntryType',
          accessor: 'OpenEntryType',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Platform',
          Footer: 'Platform',
          accessor: 'Platform',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'SL',
          Footer: 'SL',
          accessor: 'SL',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'Status',
          Footer: 'Status',
          accessor: 'Status',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TP',
          Footer: 'TP',
          accessor: 'TP',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalCommission',
          Footer: 'TotalCommission',
          accessor: 'TotalCommission',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalCurrency',
          Footer: 'TotalCurrency',
          accessor: 'TotalCurrency',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalLegs',
          Footer: 'TotalLegs',
          accessor: 'TotalLegs',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalLots',
          Footer: 'TotalLots',
          accessor: 'TotalLots',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalOrders',
          Footer: 'TotalOrders',
          accessor: 'TotalOrders',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalPositions',
          Footer: 'TotalPositions',
          accessor: 'TotalPositions',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalProfit',
          Footer: 'TotalProfit',
          accessor: 'TotalProfit',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'TotalSwap',
          Footer: 'TotalSwap',
          accessor: 'TotalSwap',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'DayofmonthFirstLegOpened',
          Footer: 'DayofmonthFirstLegOpened',
          accessor: 'dayofmonthFirstLegOpened',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'HourFirstLegOpened',
          Footer: 'HourFirstLegOpened',
          accessor: 'hourFirstLegOpened',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'MonthFirstLegOpened',
          Footer: 'MonthFirstLegOpened',
          accessor: 'monthFirstLegOpened',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'WeekFirstLegOpened',
          Footer: 'WeekFirstLegOpened',
          accessor: 'weekFirstLegOpened',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'WeekdayFirstLegOpened',
          Footer: 'WeekdayFirstLegOpened',
          accessor: 'weekdayFirstLegOpened',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        },
        {
          Header: 'YearFirstLegOpened',
          Footer: 'YearFirstLegOpened',
          accessor: 'yearFirstLegOpened',
          dataType: 'text',
          filter: 'fuzzyText',
          disableGroupBy: true
        }
      ]);
      getClosedDataSummary();
      const interval = setInterval(() => {
        getClosedDataSummary();
      }, 300000);
      return () => clearInterval(interval);
    }
  }, [item]);

  const getOpenData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/trade/trade-open-orders`);
      if (response.status === 200) {
        setResponseData([...JSON.parse(response.data.data)]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getClosedData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/trade/trade-closed-orders`);
      if (response.status === 200) {
        setResponseData([...JSON.parse(response.data.data)]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOpenDataSummary = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/trade/trade-open-orders-summary`);
      if (response.status === 200) {
        setResponseData([...JSON.parse(response.data.data)]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getClosedDataSummary = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/trade/trade-closed-orders-summary`);
      if (response.status === 200) {
        setResponseData([...JSON.parse(response.data.data)]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainCard>
      <ScrollX>
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
          <ReactTable columns={columns} data={responseData} onchange={handleClick} />
          {/* <DragPreview /> */}
        </DndProvider>
      </ScrollX>
    </MainCard>
  );
};

export default UmbrellaTable;

/* eslint-disable */

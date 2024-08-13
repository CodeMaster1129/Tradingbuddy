/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import './style/SuperResponsiveTableStyle.css';
import { CircularProgress } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';

function DashInsiderActivity({ data, isloading }) {
  const [width, setWidth] = useState(0);
  let ref = useRef();

  data.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  useEffect(() => {
    if (ref.current) {
      new ResizeObserver(() => {
        setWidth(ref.current?.clientWidth ?? 0);
      }).observe(ref.current);
    }
  }, []);

  const simplifiedFraction = (decimalString) => {
    const decimalParts = decimalString.split('/');

    const numerator = parseFloat(decimalParts[0]);
    const denominator = parseFloat(decimalParts[1]);

    const simplifiedFraction = `${numerator}/${denominator}`;

    return simplifiedFraction;
  };

  return (
    <>
      <style>
        {`
          .scrollbar::-webkit-scrollbar {
            width: 12px;
          }
          .scrollbar::-webkit-scrollbar-track {
            background: #424242;
          }
          .scrollbar::-webkit-scrollbar-thumb {
            background-color: #888; 
            border-radius: 20px;
            border: 3px solid #424242;
          }
        `}
      </style>
      <Backdrop sx={{ color: '#fff', zIndex: 999 }} open={isloading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div ref={ref} className="scrollbar" style={{ height: '100%', overflow: 'auto', background: '#1e222d', fontSize: '10px' }}>
        <div style={{ fontSize: '14px', color: '#d1d4dc', background: '#1e222d' }}>Split Activity</div>
        {width >= 175 ? (
          <Table style={{ color: '#d1d4dc', overflow: 'scroll', width: '100%', blackground: '#1e222d' }}>
            <Thead style={{ color: 'teal' }}>
              <Tr style={{ background: '#1e222d', color: '#5d606b' }}>
                <Th style={{ borderBottom: '1px solid #5d606b' }}>No</Th>
                <Th style={{ borderBottom: '1px solid #5d606b' }}>Date</Th>
                <Th style={{ borderBottom: '1px solid #5d606b' }}>Ratio</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((row, key) => (
                <Tr key={key}>
                  <Td align="center">{key + 1}</Td>
                  <Td align="center">{row.date}</Td>
                  <Td align="center">{simplifiedFraction(row.split)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Table className="smallTable" style={{ color: '#d1d4dc', overflow: 'scroll', width: '100%' }}>
            <Thead style={{ color: 'teal' }}>
              <Tr>
                <Th>No</Th>
                <Th>Date</Th>
                <Th>Ratio</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((row, key) => (
                <Tr key={key}>
                  <Td align="center">{key + 1}</Td>
                  <Td align="center">{row.date}</Td>
                  <Td align="center">{simplifiedFraction(row.split)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </div>
    </>
  );
}

export default DashInsiderActivity;

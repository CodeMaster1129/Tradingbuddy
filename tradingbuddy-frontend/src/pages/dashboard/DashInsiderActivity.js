/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import './style/SuperResponsiveTableStyle.css';

function DashInsiderActivity({ data }) {
  const [width, setWidth] = useState(0);
  let ref = useRef();

  useEffect(() => {
    if (ref.current) {
      new ResizeObserver(() => {
        setWidth(ref.current?.clientWidth ?? 0);
      }).observe(ref.current);
    }
  }, []);

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
      <div ref={ref} className="scrollbar" style={{ height: '100%', overflow: 'auto', background: '#1e222d ', fontSize: '10px' }}>
        <div style={{ fontSize: '14px', color: '#d1d4dc ', background: '#1e222d' }}>Insider Activity</div>
        {width >= 344 ? (
          <Table style={{ color: '#d1d4dc', overflow: 'scroll', width: '100%' }}>
            <Thead style={{ color: '#d1d4dc' }}>
              <Tr style={{ background: '#1e222d', color: '#5d606b' }}>
                <Th style={{ borderBottom: '1px solid #5d606b' }}>Date</Th>
                <Th style={{ borderBottom: '1px solid #5d606b' }}>Name</Th>
                <Th style={{ borderBottom: '1px solid #5d606b' }}>Title</Th>
                <Th style={{ borderBottom: '1px solid #5d606b' }}>Code</Th>
                <Th style={{ borderBottom: '1px solid #5d606b' }}>Shares</Th>
                <Th style={{ borderBottom: '1px solid #5d606b' }}>Shares Price</Th>
                <Th style={{ borderBottom: '1px solid #5d606b' }}>Total $</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((row, key) => (
                <Tr key={key}>
                  <Td align="center">{row.base.periodOfReport}</Td>
                  <Td align="center">{row.base.reportingPerson}</Td>
                  <Td align="center">{row.base.officerTitle}</Td>
                  <Td align="center">{row.codingCode}</Td>
                  <Td align="center">{row.shares}</Td>
                  <Td align="center">{row.sharePrice}</Td>
                  <Td align="center">{row.total}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Table className="smallTable" style={{ color: '#d1d4dc' }}>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Name</Th>
                <Th>Title</Th>
                <Th>Code</Th>
                <Th>Shares</Th>
                <Th>Shares Price</Th>
                <Th>Total$</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((row, key) => (
                <Tr key={key}>
                  <Td align="center">{row.base.periodOfReport}</Td>
                  <Td align="center">{row.base.reportingPerson}</Td>
                  <Td align="center">{row.base.officerTitle}</Td>
                  <Td align="center">{row.codingCode}</Td>
                  <Td align="center">{row.shares}</Td>
                  <Td align="center">{row.sharePrice}</Td>
                  <Td align="center">{row.total}</Td>
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

/* eslint-disable */
import React from 'react';
import '../dashboard/style/SuperResponsiveTableStyle.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

const DashIrregularActivity = ({ data }) => {
  const compareDesc = (a, b) => {
    const dateA = new Date(a[1].replace('st', '').replace('nd', '').replace('rd', '').replace('th', ''));
    const dateB = new Date(b[1].replace('st', '').replace('nd', '').replace('rd', '').replace('th', ''));
    return dateB - dateA;
  };

  const sortedData = data.sort(compareDesc);

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
      <div className="scrollbar" style={{ height: '100%', overflow: 'auto' }}>
        <div style={{ fontSize: '14px', color: '#d1d4dc ', overflow: 'auto', background: '#1e222d' }}>
          Irregular Volume
          <div className="scrollbar" style={{ height: '100%', overflow: 'auto', background: '#1e222d ', fontSize: '10px' }}>
            <Table style={{ color: '#d1d4dc', overflow: 'scroll', width: '100%' }}>
              <Thead style={{ color: '#d1d4dc' }}>
                <Tr style={{ background: '#1e222d', color: '#5d606b' }}>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Category</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Time Entered</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Ticker</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Company Name</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Irregular Volume</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Price Detected</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Trending</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedData?.map((row, key) => (
                  <Tr key={key}>
                    <Td align="center">{row[0]}</Td>
                    <Td align="center">{row[1]}</Td>
                    <Td align="center">{row[2]}</Td>
                    <Td align="center">{row[3]}</Td>
                    <Td align="center">{row[4]}</Td>
                    <Td align="center">{row[5]}</Td>
                    <Td align="center">{row[6]}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashIrregularActivity;
/* eslint-disable */

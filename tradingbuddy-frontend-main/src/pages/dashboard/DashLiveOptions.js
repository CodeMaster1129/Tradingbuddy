/* eslint-disable */
import React from 'react';
import '../dashboard/style/SuperResponsiveTableStyle.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

const DashLiveOptions = ({ data }) => {
  const compareTime = (a, b) => {
    const timeA = new Date(a[0]);
    const timeB = new Date(b[0]);
    return timeB - timeA;
  };

  // Sort the array using the comparison function
  const sortedArray = data.sort(compareTime);

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
          Live Options
          <div style={{ height: '100%', overflow: 'auto', background: '#1e222d ', fontSize: '10px' }}>
            <Table style={{ color: '#d1d4dc', overflow: 'scroll', width: '100%' }}>
              <Thead style={{ color: '#d1d4dc' }}>
                <Tr style={{ background: '#1e222d', color: '#5d606b' }}>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Date Time</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Ticker</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Expiry Date</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Strike</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Option Type</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Spot</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Bid</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Details</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Ask</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>OrderType</Th>
                  <Th style={{ borderBottom: '1px solid #5d606b' }}>Premium</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedArray?.map((row, key) => (
                  <Tr key={key}>
                    <Td align="center">{row[0]}</Td>
                    <Td align="center">{row[1]}</Td>
                    <Td align="center">{row[2]}</Td>
                    <Td align="center">{row[3]}</Td>
                    <Td align="center">{row[4]}</Td>
                    <Td align="center">{row[5]}</Td>
                    <Td align="center">{row[6]}</Td>
                    <Td align="center">{row[7]}</Td>
                    <Td align="center">{row[8]}</Td>
                    <Td align="center">{row[9]}</Td>
                    <Td align="center">{row[10]}</Td>
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

export default DashLiveOptions;
/* eslint-disable */

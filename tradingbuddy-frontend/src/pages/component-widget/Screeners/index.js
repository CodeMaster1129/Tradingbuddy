/* eslint-disable */
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import StockScreener from './StockScreener';
import ForexScreener from './ForexScreener';
import CryptoScreener from './CryptoScreener';

export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: '1px solid', borderColor: '#8ba3b1', marginLeft: '30px', marginRight: '30px' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="STOCK SCREENER" value="1" sx={{ color: '#8ba3b1' }} />
            <Tab label="FOREX SCREENER" value="2" sx={{ color: '#8ba3b1' }} />
            <Tab label="CRYPTO PAIRS SCREENER" value="3" sx={{ color: '#8ba3b1' }} />
          </TabList>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <TabPanel value="1" sx={{ height: '100%' }}>
            <StockScreener />
          </TabPanel>
          <TabPanel value="2" sx={{ height: '100%' }}>
            <ForexScreener />
          </TabPanel>
          <TabPanel value="3" sx={{ height: '100%' }}>
            <CryptoScreener />
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}
/* eslint-disable */

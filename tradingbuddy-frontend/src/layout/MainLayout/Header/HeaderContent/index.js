/* eslint-disable */
// material-ui
import { Box, IconButton, Link, useMediaQuery } from '@mui/material';
import { GithubOutlined } from '@ant-design/icons';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [infoData, setInfoData] = useState([]);
  const [currentActive, setCurrentActive] = useState(0);

  useEffect(() => {
    const fetchInfoData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/activity/fetch_info`);
        setInfoData(response.data);
        setCurrentActive(0); // Reset the currentActive index whenever new data is fetched
      } catch (error) {
        console.error('Error fetching info data:', error);
      }
    };

    // Fetch initial data
    fetchInfoData();

    // Set up interval to fetch new data every 60 seconds
    const fetchDataInterval = setInterval(fetchInfoData, 60000);

    return () => clearInterval(fetchDataInterval);
  }, []);

  useEffect(() => {
    // Change the active info every 6 seconds
    const changeInfoInterval = setInterval(() => {
      setCurrentActive((prevActive) => {
        if (prevActive >= infoData.length - 1) {
          return 0;
        } else {
          return prevActive + 1;
        }
      });
    }, 6000);

    return () => clearInterval(changeInfoInterval);
  }, [infoData]); // React will create a new interval whenever infoData changes

  const currentInfo = infoData[currentActive];

  return (
    <>
      {/* {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      <IconButton
        component={Link}
        href="https://google.com"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      > */}
      {/* <GithubOutlined />
      </IconButton> */}

      {/* <Notification /> */}

      <div
        style={{
          marginLeft: '40px',
          color: '#d1d4dc',
          position: 'absolute',
          fontWeight: 'bold',
          borderRight: '1px solid rgb(255, 255, 255)',
          marginRight: '20px',
          paddingRight: '20px'
        }}
      >
        INFO
      </div>
      <div style={{ color: 'white', position: 'absolute', marginLeft: '120px' }}>
        {currentInfo && (
          <>
            <span style={{ color: '#f7525f ' }}>{currentInfo.infodescription}</span>
            <span style={{ color: '#d1d4dc' }}>{currentInfo.infovalue}</span>
          </>
        )}
      </div>

      {!matchesXs && <Profile />}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;

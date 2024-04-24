/* eslint-disable */
import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText, Popper, Box } from '@mui/material';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';

// assets
import { EditOutlined, ProfileOutlined, LogoutOutlined, UserOutlined, WalletOutlined, InfoCircleOutlined } from '@ant-design/icons';

const PopupBody = styled('div')(
  () => `
  width: 290px;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
  color:#D1D4DC;
  background:#1e222d;
  border: 1px solid #D1D4DC; 
`
);

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
  const theme = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchor, setAnchor] = useState(null);

  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const open = Boolean(anchor);
  const id = open ? 'simple-popup' : undefined;

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleSubscribeItemClick = () => {
    window.open('https://ingbuddy.com/trading-2');
  };

  const handleBillingItemClick = () => {
    window.open('https://billing.stripe.com/p/login/bIY8yX2hV7qo5jOdQQ');
  };

  return (
    <>
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
        {/* <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" sx={{ color: 'white' }} />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="View Profile" sx={{ color: 'white' }} />
      </ListItemButton> */}
        <ListItemButton selected={selectedIndex === 3} onClick={() => handleSubscribeItemClick()}>
          <ListItemIcon>
            <ProfileOutlined />
          </ListItemIcon>
          <ListItemText primary="Subscribe" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 4} onClick={() => handleBillingItemClick()}>
          <ListItemIcon>
            <WalletOutlined />
          </ListItemIcon>
          <ListItemText primary="Billing" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton aria-describedby={id} selected={selectedIndex === 1} onClick={handleClick}>
          <ListItemIcon>
            <InfoCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="Disclaimer" sx={{ color: 'white' }} />
        </ListItemButton>
      </List>
      <BasePopup id={id} open={open} anchor={anchor}>
        <PopupBody>
          The information on this software tool platform is provided on an as-is basis, without any guarantee that it's accurate or useful
          for any particular purpose. Some data is machine generated. The authors cannot be held responsible for any loss or damage as a
          result of using this website, directly or indirectly. This is an overriding statement and takes precedence over any other
          statements.
        </PopupBody>
      </BasePopup>
    </>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;

/* eslint-disable */

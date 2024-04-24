/* eslint-disable */
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText, Box, TextField, Stack, Button } from '@mui/material';
import Select from 'react-select';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { toast } from 'react-toastify';

// assets
import { CommentOutlined, LockOutlined, QuestionCircleOutlined, UserOutlined, UnorderedListOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const customStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: '#1e222d'
  }),
  option: (styles, { isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? '#1e222d' : isSelected ? '#1e222d' : '#1e222d', // default color for options
      color: 'white'
    };
  },
  menu: (styles) => ({
    ...styles,
    backgroundColor: '#1e222d'
  }),
  singleValue: (styles) => ({
    ...styles,
    color: 'white'
  })
};

const PopupBody = styled('div')(
  () => `
  width: 290px;
  padding: 12px 16px;
  margin: 8px;
  margin-top: 55px;
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

const SettingTab = () => {
  const reasonOptions = [
    { value: 'feedback', label: 'Feedback' },
    { value: 'question', label: 'Question' },
    { value: 'support', label: 'Support' },
    { value: 'membership', label: 'Membership' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'something', label: 'Something else' }
  ];
  const reasonDefaultValue = { value: 'reason', label: 'Reason of contact' };

  const methodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'text', label: 'Text' },
    { value: 'phonecall', label: 'Phone Call' }
  ];
  const methodDefaultValue = { value: 'replymethod', label: 'Preferred method of reply' };

  const theme = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchor, setAnchor] = useState(null);
  const [feedbackReason, setFeedbackReason] = useState('');
  const [feedbackMethod, setFeedbackMethod] = useState('');
  const [userData, setUserData] = useState({});
  const [feedback, setFeedback] = useState('');

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const handleReasonChange = (event) => {
    setFeedbackReason(event.value);
  };

  const handleMethodChange = (event) => {
    setFeedbackMethod(event.value);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSendClick = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('email', userData.email);
    bodyFormData.append('feedbackReason', feedbackReason);
    bodyFormData.append('feedbackMethod', feedbackMethod);
    bodyFormData.append('feedback', feedback);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/activity/setfeedback`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Feedback Send Success!');
        }
      })
      .catch((err) => {
        if (err.response.status === 405) toast.warn(err.response.FormData);
        else toast.error(err.response.data);
      });
    setAnchor(null);
  };

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem('userData')));
  }, []);

  const open = Boolean(anchor);
  const id = open ? 'simple-popup' : undefined;

  return (
    <>
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
        <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
          <ListItemIcon>
            <QuestionCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="Support" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
          <ListItemIcon>
            <UserOutlined />
          </ListItemIcon>
          <ListItemText primary="Account Settings" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
          <ListItemIcon>
            <LockOutlined />
          </ListItemIcon>
          <ListItemText primary="Privacy Center" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton aria-describedby={id} onClick={handleClick}>
          <ListItemIcon>
            <CommentOutlined />
          </ListItemIcon>
          <ListItemText primary="Feedback" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}>
          <ListItemIcon>
            <UnorderedListOutlined />
          </ListItemIcon>
          <ListItemText primary="History" sx={{ color: 'white' }} />
        </ListItemButton>
      </List>
      <BasePopup id={id} open={open} anchor={anchor}>
        <PopupBody>
          <Box sx={{ padding: '5px' }}>
            <Stack spacing={1}>
              <Box sx={{ color: '#D1D4DC', fontSize: '16px', fontWeight: 'bold' }}>Let's connect</Box>
              <Box>Have a question? Like to leave some feedback? Just want to sav hello? Feel free to contact us</Box>
              <TextField id="outlined-basic" fullWidth value={userData.email} disabled />
              <Select styles={customStyles} defaultValue={reasonDefaultValue} options={reasonOptions} onChange={handleReasonChange} />
              <Select styles={customStyles} defaultValue={methodDefaultValue} options={methodOptions} onChange={handleMethodChange} />
              <TextField
                id="outlined-basic"
                multiline
                rows={3}
                onChange={handleFeedbackChange}
                fullWidth
                placeholder="Feedback"
                InputProps={{
                  style: {
                    color: '#D1D4DC'
                  }
                }}
              />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <AttachFileIcon />
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendClick}>
                  Send
                </Button>
              </Stack>
            </Stack>
          </Box>
        </PopupBody>
      </BasePopup>
    </>
  );
};

export default SettingTab;

/* eslint-disable */

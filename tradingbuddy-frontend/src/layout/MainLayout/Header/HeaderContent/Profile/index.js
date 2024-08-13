/* eslint-disable */
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Typography,
  Link,
  TextField,
  Button
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';

// assets
import avatar1 from 'assets/images/users/avatar-common.png';
import { LogoutOutlined, SettingOutlined, UserOutlined, CommentOutlined } from '@ant-design/icons';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

const PopupBody = styled('div')(
  () => `
  width: 290px;
  padding: 12px 16px;
  margin: 8px;
  margin-top: 25px;
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

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
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

  const adminEmails = ['eliking0502@gmail.com', 'twakley@ingbuddy.com'];

  const theme = useTheme();
  const navigate = useNavigate();
  const userLocal = localStorage.getItem('userData');
  const [userData, setUserData] = useState({});
  const [anchor, setAnchor] = useState(null);
  const [feedbackReason, setFeedbackReason] = useState('');
  const [feedbackMethod, setFeedbackMethod] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setUserData(JSON.parse(userLocal));
  }, [userLocal]);
  const handleLogout = async () => {
    localStorage.removeItem('token');
    navigate('/');
    // logout
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const handleFile = (e) => {
    alert('test');
    const file = e.target.files[0]; // accessing file
    console.log(file); // you would see the file
  };

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem('userData')));
  }, []);

  const handlePopupClose = () => {
    if (opened) {
      setAnchor(null);
    }
  };

  const iconBackColorOpen = 'grey.300';

  const opened = Boolean(anchor);
  const id = opened ? 'simple-popup' : undefined;

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }} style={{ display: 'flex', alignItems: 'center' }}>
      {adminEmails.includes(userData.email) && (
        <Link
          underline="none"
          href="https://master.d1i7wv1mkke7pb.amplifyapp.com/"
          target="_blank"
          style={{ color: '#D1D4DC', display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '20px' }}
        >
          <AdminPanelSettingsIcon style={{ fontSize: '20px' }} />
          <Typography>Admin</Typography>
        </Link>
      )}
      <ClickAwayListener onClickAway={handlePopupClose}>
        <Stack>
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            style={{ color: '#D1D4DC', marginRight: '20px' }}
            onClick={handleClick}
          >
            <CommentOutlined style={{ fontSize: '20px' }} />
            <Typography>Feedback</Typography>
          </Stack>
          <BasePopup id={id} open={opened} anchor={anchor}>
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
                    <input
                      accept="*"
                      style={{ display: 'none' }}
                      id="raised-button-file"
                      multiple
                      type="file"
                      onChange={handleFile} // file handling function
                    />
                    <label htmlFor="raised-button-file">
                      <IconButton sx={{ color: '#D1D4DC' }}>
                        <AttachFileIcon />
                      </IconButton>
                    </label>
                    <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendClick}>
                      Send
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </PopupBody>
          </BasePopup>
        </Stack>
      </ClickAwayListener>
      <Link
        underline="none"
        href="https://zoom.us/j/92735085625?pwd=NnNyTVlQeTVVd0VoejZleDIwcWVuQT09"
        target="blank"
        style={{ color: '#D1D4DC', display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '20px' }}
      >
        <VideocamIcon style={{ fontSize: '20px' }} />
        <Typography>Zoom</Typography>
      </Link>
      <Link
        underline="none"
        href="https://drive.google.com/drive/folders/1vg9B4DZ9gIHEnSo4U4-r-_LVXzkr6Wid?usp=sharing"
        target="blank"
        style={{ marginRight: '20px', color: '#D1D4DC', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <QuizIcon style={{ fontSize: '20px' }} />
        <Typography>Help</Typography>
      </Link>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
          <Typography variant="subtitle1" sx={{ color: 'white' }}>
            {userData.firstName + '  ' + userData.lastName}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
        sx={{ border: '1px solid #D1D4DC', borderRadius: '5px' }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false} sx={{ bgcolor: '#1e222d' }}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
                            <Stack>
                              <Typography variant="h6" sx={{ color: 'white' }}>
                                {userData.firstName + '  ' + userData.lastName}
                              </Typography>
                              {/* <Typography variant="body2" sx={{color:'white'}}>
                                UI/UX Designer
                              </Typography> */}
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <IconButton size="large" color="secondary" onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {open && (
                      <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize',
                                color: 'white'
                              }}
                              icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Profile"
                              {...a11yProps(0)}
                            />
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize',
                                color: 'white'
                              }}
                              icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Setting"
                              {...a11yProps(1)}
                            />
                          </Tabs>
                        </Box>
                        <TabPanel value={value} index={0} dir={theme.direction}>
                          <ProfileTab handleLogout={handleLogout} />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                          <SettingTab />
                        </TabPanel>
                      </>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;

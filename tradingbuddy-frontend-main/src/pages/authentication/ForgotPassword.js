/* eslint-disable */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Stack, Typography, InputLabel, OutlinedInput, Button } from '@mui/material';
import AuthWrapper from './AuthWrapper';
import axios from 'axios';
import { toast } from 'react-toastify';

// Utility function to validate email
const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const ForgotPassword = () => {
  // State for the email, password, confirm password, and any error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Handle form submission
  const handleRegister = async (event) => {
    event.preventDefault();
    // Reset previous errors
    setError('');
    setEmailError('');

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      // If not, set an error message
      setError('Passwords do not match!');
    } else {
      // If email and passwords are valid, proceed with the registration logic
      console.log('Register with:', email, password); // Placeholder for actual registration logic
      // Perform additional actions like updating the state or redirecting the user
      var bodyFormData = new FormData();
      bodyFormData.append('email', email);
      bodyFormData.append('password', password);
      await axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}/auth/forgotpassword`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 405) toast.warn(err.response.FormData);
          else toast.error(err.response.data);
        });
    }
  };

  return (
    <AuthWrapper>
      {/* ... other components ... */}
      <form onSubmit={handleRegister}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3" sx={{ color: '#009788' }}>
                Register
              </Typography>
              <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none', color: '#009788' }}>
                Back to Login
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email" sx={{ color: 'white' }}>
                  Email Address
                </InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  fullWidth
                  sx={{ color: 'white' }}
                />
                {emailError && (
                  <Typography color="error" variant="caption">
                    {emailError}
                  </Typography>
                )}
              </Stack>
              <Stack spacing={1}>
                <InputLabel htmlFor="password" sx={{ color: 'white' }}>
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  fullWidth
                  sx={{ color: 'white' }}
                />
              </Stack>
              <Stack spacing={1}>
                <InputLabel htmlFor="confirm-password" sx={{ color: 'white' }}>
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter confirm password"
                  fullWidth
                  sx={{ color: 'white' }}
                />
                {error && (
                  <Typography color="error" variant="caption">
                    {error}
                  </Typography>
                )}
              </Stack>
              <Button
                disableElevation
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                style={{ backgroundColor: '#009788', marginTop: '60px' }}
              >
                Reset Password
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </AuthWrapper>
  );
};

export default ForgotPassword;
/* eslint-disable */

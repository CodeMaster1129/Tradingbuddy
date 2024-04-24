/* eslint-disable */
import PropTypes from 'prop-types';

// material-ui
import { Box, Grid, Typography, ButtonBase } from '@mui/material';
import { styled } from '@mui/material/styles';

// project import
import AuthCard from './AuthCard';
import AuthFooter from 'components/cards/AuthFooter';

// assets
import AuthBackground from 'assets/images/auth/AuthBackground';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //
const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%'
});

const AuthWrapper = ({ children }) => (
  <Box sx={{ minHeight: '100vh', bgcolor: '#161313' }}>
    <AuthBackground />
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        minHeight: '100vh'
      }}
    >
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          container
          justifyContent="center"
          alignItems="center"
          // sx={{ minHeight: { xs: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' }, display: 'flex', flexDirection: 'column' }}
        >
          <Typography variant="h1" sx={{ fontWeight: 'bold', color: '#009788' }}>
            Trading Buddy
          </Typography>
          <Typography variant="h4" sx={{ color: '#009788', paddingLeft: '10px' }}>
            Tools
          </Typography>
          <Grid item xs={12} md={12} lg={12}></Grid>
          <Grid item xs={4} md={4} lg={4}>
            <ButtonBase style={{ padding: '6%', minHeight: '100%' }}>
              <Img src="/Bg1.PNG" alt="bg error loading" style={{ borderRadius: '2%' }} />
            </ButtonBase>
          </Grid>
          <Grid item xs={4} md={4} lg={4}>
            <AuthCard>{children}</AuthCard>
          </Grid>
          <Typography sx={{ color: '#D1D4DC', fontSize: '10px', paddingLeft: '15%', paddingRight: '15%', paddingTop: '50px' }}>
            TRADING BUDDY TOOLS and ingBuddy Inc DISCLAIMER & USER AGREEMENT: By accessing TRADING BUDDY TOOLS or any associated platforms,
            you acknowledge that all content is for educational purposes only and not investment advice. You agree that
            tradingbuddytools.com, and ingBuddy Inc, along with their staff and affiliates, do not endorse or recommend any specific
            financial products. You accept full responsibility for your investment decisions and will consult your financial advisor as
            necessary. You also consent to the use of your personal information for promotional purposes related to tradingbuddytools.com
            and its affiliates. You understand that investment decisions should be based on your individual financial situation, risk
            tolerance, and market understanding. You agree to indemnify tradingbuddytools.com, and ingBuddy Inc against any losses or
            damages from your trading activities. While we strive for accuracy, we do not guarantee the timeliness or accuracy of the
            information provided. Our staff may hold positions in the securities discussed, but this does not influence our content. The
            information on our platforms is confidential and proprietary, and reproduction without written permission from
            tradingbuddytools.com, and ingBuddy Inc is prohibited. By entering our platform, you agree to these terms.our trading
            activities. While we strive for accuracy, we do not guarantee the timeliness or accuracy of the information provided. Our staff
            may hold positions in the securities discussed, but this does not influence our content. The information on our platforms is
            confidential and proprietary, and reproduction without written permission from tradingbuddytools.com, and ingBuddy Inc is
            prohibited. By entering our platform, you agree to these term
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <AuthFooter />
      </Grid>
    </Grid>
  </Box>
  // <Box sx={{ minHeight: '100vh', bgcolor: '#161313' }}>
  //   <Box
  //     sx={{
  //       // minHeight: { xs: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' },
  //       display: 'flex',
  //       flexDirection: 'column',
  //       bgcolor: 'red',
  //       width: '100px',
  //       height: '200px'
  //     }}
  //   >
  //     qweqw
  //   </Box>
  // </Box>
);

AuthWrapper.propTypes = {
  children: PropTypes.node
};

export default AuthWrapper;
/* eslint-disable */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import lionLogo from 'assets/lionlogo.png';
import { useTheme } from '@mui/material/styles';

const Logo = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavigateToDashboard = () => {
    // window.location.href = '/'; // Set the URL to root and reload the page
    window.location.replace('/'); // Replaces the current URL and reloads the page
    // navigate('/');
  };

  return (
    <Box display='flex' alignItems='center' flexGrow={1}>
      <Box
        onClick={handleNavigateToDashboard}
        display='flex'
        alignItems='center'
        sx={{ cursor: 'pointer' }}>
        <img src={lionLogo} alt='lion logo' width='40' height='40' />
        <Typography
          display={{ xs: 'none', sm: 'flex' }}
          variant='h6'
          component='div'
          sx={{
            ml: 2,
            color: theme.palette.getContrastText(theme.palette.white.main)
          }}>
          Technopreneurship
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;

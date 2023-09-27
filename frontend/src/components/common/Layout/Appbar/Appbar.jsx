import React from 'react';
import lionLogo from 'assets/lionlogo.png';

import {
  Box,
  Button,
  AppBar as MuiAppBar,
  Toolbar,
  Typography
} from '@mui/material';

const Appbar = () => {
  return (
    <MuiAppBar position='static'>
      <Toolbar>
        <Box display='flex' alignItems='center' flexGrow={1}>
          <img src={lionLogo} alt='lion logo' width='40' height='40' />
          <Typography display={{xs: 'none', sm: 'flex'}} variant='h6' component='div' sx={{ ml: 2 }}>
            Technopreneurship
          </Typography>
        </Box>
        <Box>
          <Button color='inherit'>Profile</Button>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default Appbar;

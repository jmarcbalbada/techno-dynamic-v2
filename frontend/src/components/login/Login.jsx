import React from 'react';
import HeroGrid from '../common/HeroGrid';
import LoginForm from './LoginForm';
import lionlogo from '../../assets/lionlogo.png';
import styles from './Login.module.css';
import Copyright from '../copyright/Copyright';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Login = () => {
  const LogoDivider = styled(Divider)(({ theme }) => ({
    borderBottomWidth: 4,
    borderBottomColor: '#ffcc00'
  }));

  return (
    <Grid container component='main' sx={{ height: '100vh' }}>
      <HeroGrid item xs={false} sm={4} md={7} />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        p={4}
        square>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems='center'
          justifyContent='center'
          spacing={3}
          m={4}
          sx={{
            flexShrink: 0
          }}>
          <Box className={styles['lionborder']}>
            <img src={lionlogo} className={styles['lionlogo']}></img>
          </Box>
          <Typography
            variant='h2'
            sx={{
              textTransform: 'uppercase',
              letterSpacing: 10
            }}>
            Login
          </Typography>
        </Stack>
        <LogoDivider />
        <LoginForm />
        <Copyright sx={{ mt: 8 }} />
      </Grid>
    </Grid>
  );
};

export default Login;

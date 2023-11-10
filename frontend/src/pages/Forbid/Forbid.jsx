import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import styles from './Forbid.module.css';

const Forbid = () => {
  const navigate = useNavigate();
  const handleBacktoDashboard = () => {
    navigate('/');
  };

  return (
    <Container>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        width={1}
        height='100dvh'>
        <img
          src='/illustrations/Forbidden.png'
          className={styles['forbid']}
          alt='Done'
        />
        <Typography variant='h4' align='center' gutterBottom>
          Forbidden
        </Typography>
        <Box>
          <Button
            onClick={handleBacktoDashboard}
            size='large'
            variant='contained'>
            Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Forbid;

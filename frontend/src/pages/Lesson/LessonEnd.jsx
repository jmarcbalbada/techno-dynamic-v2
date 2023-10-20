import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import styles from './LessonEnd.module.css';

const LessonEnd = () => {
  const navigate = useNavigate();
  const handleBacktoDashboard = () => {
    navigate('/');
  };

  return (
    <Container>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <img
          src='/illustrations/done.png'
          className={styles['done']}
          alt='Done'
        />
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

export default LessonEnd;

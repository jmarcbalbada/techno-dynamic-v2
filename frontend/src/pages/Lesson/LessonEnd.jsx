import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import styles from './LessonEnd.module.css';

const LessonEnd = () => {
  const { lessonNumber } = useParams();
  const navigate = useNavigate();
  const handleBacktoDashboard = () => {
    navigate('/');
  };

  return (
    <Container>
      <Box mt={3} display='flex' flexDirection='column' alignItems='center'>
        <img
          src='/illustrations/done.png'
          className={styles['done']}
          alt='Done'
        />
        <Typography variant='h4' align='center' gutterBottom>
          Lesson {lessonNumber} Completed!
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

export default LessonEnd;

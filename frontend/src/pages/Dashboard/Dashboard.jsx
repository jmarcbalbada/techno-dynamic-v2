import React from 'react';
import CourseDetails from 'components/dashboard/CourseDetails';

import { Box, Container } from '@mui/material';

const Dashboard = () => {
  return (
    <Container>
      <h1>Dashboard</h1>
      <Box>
        <CourseDetails />
      </Box>
    </Container>
  );
};

export default Dashboard;

import { Box, Container, Paper, Typography } from '@mui/material';
import React from 'react';

const FooterControls = () => {
  return (
    <Paper elevation={3} sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      py: 3,
      px: 2,
    }}>
      <Container>
        <Typography variant='body1'>Controls Here</Typography>
      </Container>
    </Paper>
    // <Box
    //   component='footer'
    //   sx={{
    //     position: 'fixed',
    //     py: 3,
    //     px: 2,
    //     mt: 'auto',
    //     borderTop: '1px solid black'
    //   }}>
    //   <Container>
    //     <Typography variant='body1'>Controls Here</Typography>
    //   </Container>
    // </Box>
  );
};

export default FooterControls;

import React from 'react';
import { Divider, Chip, Box, Typography } from '@mui/material';

const StudentInfo = ({ user }) => {
  return (
    <>
      <Divider
        textAlign="left"
        sx={{
          my: 2,
          "&::before": {
            display: "none",
            padding: 0,
          },
          ".MuiDivider-wrapper": {
            paddingLeft: 0,
          },
        }}
      >
        <Chip label="Student Information" variant="outlined" />
      </Divider>
      <Box display="flex" flexDirection="column">
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
          }}
        >
          Year Level
        </Typography>
        <Typography variant="h6" gutterBottom>
          {user?.student_data?.year}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
          }}
        >
          Course
        </Typography>
        <Typography variant="h6" gutterBottom>
          {user?.student_data?.course}
        </Typography>
      </Box>
    </>
  );
};

export default StudentInfo;

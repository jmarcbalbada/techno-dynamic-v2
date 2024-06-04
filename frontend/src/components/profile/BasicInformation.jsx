import React from 'react';
import { Box, Typography, Divider, Chip, Paper } from '@mui/material';

const BasicInformation = ({ user, display }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      }}
    >
      <Divider
        textAlign="left"
        sx={{
          mb: 2,
          "&::before": {
            display: "none",
            padding: 0,
          },
          ".MuiDivider-wrapper": {
            paddingLeft: 0,
          },
        }}
      >
        <Chip label="Basic Information" variant="outlined" />
      </Divider>
      <Box display="flex" flexDirection="column">
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
          }}
        >
          First Name
        </Typography>
        <Typography variant="h6" gutterBottom>
          {user?.first_name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
          }}
        >
          Last Name
        </Typography>
        <Typography variant="h6" gutterBottom>
          {user?.last_name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
          }}
        >
          Email
        </Typography>
        <Typography variant="h6" gutterBottom>
          {user?.email}
        </Typography>
        {display}
      </Box>
    </Paper>
  );
};

export default BasicInformation;

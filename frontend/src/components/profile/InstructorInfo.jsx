import React from 'react';
import { Divider, Chip, Box, Typography, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import SuggestionButton from './SuggestionButton'; // Adjust the import path

import ThresholdInputButton from './ThresholdInputButton'; // Adjust the import path
import NotificationThresholdInputButton from './NotificationThresholdInputButton'; // Adjust the import path
const InstructorInfo = () => {
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
        <Chip label="Instructor Information" variant="outlined" />
      </Divider>
      <Box display="flex" gap={1}>
        <Typography variant="h5" gutterBottom>
          Instructor Account
        </Typography>
        <Tooltip title="Verified">
          <CheckIcon sx={{ color: "green", fontSize: "1.7rem" }} />
        </Tooltip>
      </Box>

      <SuggestionButton />

        <ThresholdInputButton />
        <NotificationThresholdInputButton />
    </>
  );
};

export default InstructorInfo;

import React, { useEffect, useState } from 'react';
import { Divider, Chip, Box, Typography, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import SuggestionButton from './SuggestionButton'; // Adjust the import path
import { TeacherService } from '../../apis/TeacherService';
import { useAuth } from '../../hooks/useAuth';
import ThresholdInputButton from './ThresholdInputButton'; // Adjust the import path
import NotificationThresholdInputButton from './NotificationThresholdInputButton'; // Adjust the import path
const InstructorInfo = () => {
  const { suggestion } = useAuth();
  const [suggestions, setSuggestions] = useState(suggestion);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await TeacherService.getTeacherSuggestion();
        setSuggestions(response.data.teacher_allow_suggestion);
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      }
    };
    fetchSuggestions();
  }, []);
  return (
    <>
      <Divider
        textAlign='left'
        sx={{
          my: 2,
          '&::before': {
            display: 'none',
            padding: 0
          },
          '.MuiDivider-wrapper': {
            paddingLeft: 0
          }
        }}>
        <Chip label='Instructor Information' variant='outlined' />
      </Divider>
      <Box display='flex' gap={1}>
        <Typography variant='h5' gutterBottom>
          Instructor Account
        </Typography>
        <Tooltip title='Verified'>
          <CheckIcon sx={{ color: 'green', fontSize: '1.7rem' }} />
        </Tooltip>
      </Box>

      <SuggestionButton />
      {suggestions && (
        <>
          <ThresholdInputButton />
          <NotificationThresholdInputButton />
        </>
      )}
    </>
  );
};

export default InstructorInfo;

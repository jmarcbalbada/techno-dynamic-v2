import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Input,
  Button,
  useTheme
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../../hooks/useAuth';
import { TeacherService } from '../../apis/TeacherService';
import { useForm, Controller } from 'react-hook-form';
import HelpIcon from '@mui/icons-material/Help';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Define the validation schema
const schema = yup.object().shape({
  threshold: yup
    .number()
    .required('Threshold is required')
    .min(0.1, 'Threshold must be at least 0.1')
    .max(1, 'Threshold cannot be greater than 1')
});
const ThresholdInputButton = () => {
  const theme = useTheme();
  const { threshold } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      threshold: threshold
    }
  });

  const onSubmit = async (data) => {
    try {
      await TeacherService.setTeacherThreshold(data.threshold);
      alert('Threshold updated successfully');
    } catch (error) {
      console.error('Failed to update threshold', error);
      alert('Failed to update threshold');
    }
  };

  return (
    <Box
      display='flex'
      alignItems='center'
      gap={2}
      component='form'
      onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h6' gutterBottom>
        Context Similarity Threshold
      </Typography>
      <Tooltip
        title={
          <>
            <Typography variant='body1'>
              Context Similarity Threshold
            </Typography>
            <Typography variant='body2'>RANGE: from 0.1 ~ 1.0.</Typography>
            <Typography variant='body2'>
              <br />
              Near 1.0: groups exact matches per word (high sensitivity).
            </Typography>
            <Typography variant='body2'>
              <br />
              Near 0.1: groups contextually similar questions (more flexible).
            </Typography>
            <Typography variant='body2'>
              <br />
              Recommended: 0.3
            </Typography>
          </>
        }>
        <HelpIcon
          sx={{ color: theme.palette.background.neutral, fontSize: '1.0rem' }}
        />
      </Tooltip>
      <Controller
        name='threshold'
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            step='0.01'
            type='number'
            error={Boolean(errors.threshold)}
            placeholder='Input 0.1 - 1.0 value'
            inputProps={{
              style: {
                MozAppearance: 'textfield' // remove arrow for firefox
              }
            }}
            sx={{
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                {
                  WebkitAppearance: 'none', // for chrome and safari
                  margin: 0
                }
            }}
          />
        )}
      />
      {errors.threshold && (
        <Typography color='error' variant='body2'>
          {errors.threshold.message}
        </Typography>
      )}
      <Button variant='contained' color='primary' type='submit'>
        Save
      </Button>
    </Box>
  );
};

export default ThresholdInputButton;

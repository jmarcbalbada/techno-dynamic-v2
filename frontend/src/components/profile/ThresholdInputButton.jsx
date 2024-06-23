import React, { useState } from 'react';
import { Box, Typography, Tooltip, Input, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../../hooks/useAuth';
import { TeacherService } from '../../apis/TeacherService';
import { useForm, Controller } from 'react-hook-form';
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
    const { threshold } = useAuth();
    const { control, handleSubmit, formState: { errors } } = useForm({
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
        <Box display="flex" alignItems="center" gap={2} component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" gutterBottom>
                Context Similarity Threshold
            </Typography>
            <Tooltip title="Recommended">
                <AutoAwesomeIcon sx={{ color: '#4c80d4', fontSize: '1.0rem' }} />
            </Tooltip>
            <Controller
                name="threshold"
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        step="0.01"
                        type="number"
                        error={Boolean(errors.threshold)}
                        placeholder="Input the value"
                    />
                )}
            />
            {errors.threshold && (
                <Typography color="error" variant="body2">
                    {errors.threshold.message}
                </Typography>
            )}
            <Button variant="contained" color="primary" type="submit">
                Save
            </Button>
        </Box>
    );
};

export default ThresholdInputButton;
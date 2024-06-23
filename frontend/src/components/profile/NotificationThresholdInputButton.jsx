import React, { useState } from 'react';
import { Box, Typography, Tooltip, Input, Button } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../../hooks/useAuth';
import { TeacherService } from '../../apis/TeacherService';

const ThresholdInputButton = () => {
    const { threshold } = useAuth();
    const [thresholds, setThresholds] = useState(threshold);
    const [error, setError] = useState('');

    const handleSave = async () => {
        const thresholdValue = parseFloat(thresholds); // Convert the input value to a float
        if (isNaN(thresholdValue) || thresholdValue <= 2) {
            setError('Please enter a valid number greater than 2');
            return;
        }
        setError('');
        try {
            console.log("profile threshold", thresholdValue);
            await TeacherService.setTeacherNotification(thresholdValue);
            alert('Threshold updated successfully');
        } catch (error) {
            console.error('Failed to update threshold', error);
            alert('Failed to update threshold');
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6" gutterBottom>
                Notification Threshold
            </Typography>
            <Tooltip title="Recommended">
                <AutoAwesomeIcon sx={{ color: '#4c80d4', fontSize: '1.0rem' }} />
            </Tooltip>
            <Input
                step="0.01"
                type="number"
                value={thresholds}
                onChange={(e) => setThresholds(e.target.value)}
                placeholder="Input the value"
                error={Boolean(error)}
            />
            {error && (
                <Typography color="error" variant="body2">
                    {error}
                </Typography>
            )}
            <Button variant="contained" color="primary" onClick={handleSave}>
                Save
            </Button>
        </Box>
    );
};

export default ThresholdInputButton;

import React, { useState } from 'react';
import { Box, Typography, Tooltip, Switch } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAuth } from '../../hooks/useAuth';
import { TeacherService } from '../../apis/TeacherService';

const SuggestionButton = () => {
  const { suggestion } = useAuth();
  const [suggestions, setSuggestions] = useState(suggestion);

  const handleSuggestion = async (event) => {
    const similarity = event.target.checked;
    try {
      console.log("similarity", similarity);
      await TeacherService.setTeacherSuggestion(similarity);
      setSuggestions(similarity); // Update state with the new value
    } catch (error) {
      console.error('Failed to set suggestion', error);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="h6" gutterBottom>
        Allow AI Insights and Content Suggestions
      </Typography>
      <Tooltip title="Recommended">
        <AutoAwesomeIcon sx={{ color: "#4c80d4", fontSize: "1.0rem" }} />
      </Tooltip>
      <Switch checked={suggestions} onChange={handleSuggestion} />
    </Box>
  );
};

export default SuggestionButton;

import { useState, useEffect } from 'react';
import { TeacherService } from "../apis/TeacherService";

// Custom hook to set and retrieve the threshold works like usestate
const useSuggestion = (initialValue) => {
  const [suggestion, setSuggestion] = useState(initialValue);

  const setTeacherSuggestion = async (value) => {
    try {
      const response = await TeacherService.setTeacherSuggestion(value);
      setSuggestion (response.data.allow_insight_suggestion);
    } catch (error) {
      console.error("Error setting suggestion:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (initialValue !== undefined) {
      setTeacherSuggestion(initialValue);
    }
  }, [initialValue]);

  return [suggestion, setSuggestion];
};

export default useSuggestion;

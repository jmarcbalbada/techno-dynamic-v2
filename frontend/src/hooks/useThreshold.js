import { useState, useEffect } from 'react';
import { TeacherService } from "../apis/TeacherService";

// Custom hook to set and retrieve the threshold works like usestate
const useThreshold = (initialValue) => {
  const [threshold, setThreshold] = useState(initialValue);

  const setTeacherThreshold = async (value) => {
    try {
      const response = await TeacherService.setTeacherThreshold(value);
      setThreshold(response.data.similarity_threshold);
    } catch (error) {
      console.error("Error setting threshold:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (initialValue !== undefined) {
      setTeacherThreshold(initialValue);
    }
  }, [initialValue]);

  return [threshold, setTeacherThreshold];
};

export default useThreshold;

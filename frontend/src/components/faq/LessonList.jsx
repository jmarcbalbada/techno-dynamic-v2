import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GeneralContextList from './GeneralContextList';
import { LessonsService } from 'apis/LessonsService.js';
import { useTheme } from '@mui/material/styles';

const LessonList = () => {
  const theme = useTheme();
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await LessonsService.list();
      if (response.data) {
        setLessons(response.data);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  return (
    <Box>
      {lessons.map((lesson) => (
        <Accordion
          key={lesson.id}
          onChange={() => setSelectedLessonId(lesson.id)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                fontWeight: '600',
                fontSize: '110%',
                color: theme.palette.primary.main
              }}>
              {lesson.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {selectedLessonId === lesson.id && (
              <GeneralContextList lessonId={lesson.id} />
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default LessonList;

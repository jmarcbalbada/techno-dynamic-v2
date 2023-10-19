import React, { useState, useEffect } from 'react';

import { LessonsService } from 'apis/LessonsService';
import EditorForm from 'components/editor/EditorForm';

import { Box, Container } from '@mui/material';

const Create = () => {
  const [highestLessonNumber, setHighestLessonNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getLessons();
  }, []);

  const getLessons = async () => {
    try {
      const response = await LessonsService.list();
      const highestNumber = response.data.reduce(
        (highest, currentLesson) =>
          currentLesson.lessonNumber > highest
            ? currentLesson.lessonNumber
            : highest,
        0
      ) + 1;
      setHighestLessonNumber(highestNumber);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component='main'>
      <Box>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <EditorForm initialLessonNumber={highestLessonNumber} />
        )}
      </Box>
    </Container>
  );
};

export default Create;

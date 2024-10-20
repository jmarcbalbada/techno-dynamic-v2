import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { LessonsService } from 'apis/LessonsService';
import EditorForm from 'components/editor/EditorForm';

import { Box } from '@mui/material';
import Container from '@mui/material/Container';

const Edit = () => {
  const { lessonNumber } = useParams();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lessonId, setLessonId] = useState(null);

  useEffect(() => {
    getLessonLessonNumber(lessonNumber);
  }, []);

  const getLessonLessonNumber = async (lessonNumber) => {
    try {
      const response = await LessonsService.getByLessonNumber(lessonNumber);
      setLesson(response.data);
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
          <EditorForm lesson={lesson} isEdit={true} />
        )}
      </Box>
    </Container>
  );
};

export default Edit;

import React from 'react';
import { useParams } from 'react-router-dom';
import LessonPage from 'components/lessonpage/LessonPage';

import Container from '@mui/material/Container'

const Lesson = () => {
  const { lessonid } = useParams();

  return (
    <Container sx={{
      my: 2
    }}>
      <LessonPage>

      </LessonPage>
    </Container>
  );
};

export default Lesson;

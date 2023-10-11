import React from 'react';
import { useParams } from 'react-router-dom';

import Editor from './Editor';

import Container from '@mui/material/Container';

const Edit = () => {
  const { lessonid } = useParams();
  return (
    <Container
      sx={{
        mt: 2
      }}>
      <Editor />
    </Container>
  );
};

export default Edit;

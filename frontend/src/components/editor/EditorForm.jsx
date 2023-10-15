import React, { useState, useCallback } from 'react';
import { useFormik } from 'formik';

import { BaseDetailsValidationSchema } from './BaseDetailsValidationSchema';
import BaseDetailsForm from './BaseDetailsForm';
import PagesList from './PagesList';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const EditorForm = () => {
  const [pages, setPages] = useState([{ contents: '<h1>Page 1</h1>' }]);

  const formikBase = useFormik({
    initialValues: {
      lessonNumber: 0,
      title: '',
      subtitle: ''
    },
    validationSchema: BaseDetailsValidationSchema,
    onSubmit: (values) => {
      console.log('pages', pages);
      console.log('values', values);
    }
  });

  return (
    <Container component='main'>
      <Box component='form' onSubmit={formikBase.handleSubmit} my={4}>
        <Stack divider={<Divider flexItem />} spacing={2}>
          <Typography variant='h4'>Create a New Lesson</Typography>
          <Box mt={4}>
            <BaseDetailsForm formikBase={formikBase} />
          </Box>
          <Box mt={4}>
            <PagesList pages={pages} setPages={setPages} />
          </Box>
          <Box>
            <Button type='submit' fullWidth variant='contained'>
              Create Lesson
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditorForm;

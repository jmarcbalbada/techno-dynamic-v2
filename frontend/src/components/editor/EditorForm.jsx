import React, { useState, useCallback } from 'react';
import { useFormik } from 'formik';

import { LessonsService } from 'apis/LessonsService';
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
    onSubmit: async (values) => {
      try {
        const data = {
          lessonNumber: values.lessonNumber,
          title: values.title,
          subtitle: values.subtitle,
          pages: pages
        };
        console.log('data', data)
        const response = await LessonsService.create(data);
        console.log('response', response);
      } catch (error) {
        console.log('error', error);
      }
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

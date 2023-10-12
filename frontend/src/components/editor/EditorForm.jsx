import React from 'react';
import { useFormik } from 'formik';

import Editor from './Editor';

import { Box } from '@mui/material';
import { styled } from '@mui/material';
import {
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import NoteAddIcon from '@mui/icons-material/NoteAdd';

const FieldPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2]
}));

const EditorForm = () => {
  const formik = useFormik({
    initialValues: {
      lessonNumber: 0,
      title: '',
      subtitle: '',
      pages: [{ id: 0, contents: '' }]
    }
  });

  const handleAddPage = () => {
    formik.setFieldValue('pages', [...formik.values.pages, {}]);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 1);
  };

  const handleRemovePage = (index) => {
    const pages = formik.values.pages;
    if (pages.length === 1) {
      // show error message or disable remove button
      return;
    }
    // TODO: fix removing last page
    const newPages = pages.filter((_, i) => i !== index);
    formik.setFieldValue('pages', newPages);
  };

  return (
    <Container component='main'>
      <Box component='form' my={4}>
        <Stack divider={<Divider flexItem />} spacing={2}>
          <Typography variant='h4'>Create a New Lesson</Typography>
          <Box>
            <FieldPaper>
              <TextField
                fullWidth
                autoFocus
                autoComplete='off'
                required
                id='lessonNumber'
                name='lessonNumber'
                label='Lesson Number'
                type='number'
                value={formik.values.lessonNumber}
                onChange={formik.handleChange}
              />
            </FieldPaper>
          </Box>
          <Box>
            <FieldPaper>
              <TextField
                fullWidth
                autoComplete='off'
                required
                id='title'
                name='title'
                label='Title'
                value={formik.values.title}
                onChange={formik.handleChange}
              />
            </FieldPaper>
          </Box>
          <Box>
            <FieldPaper>
              <TextField
                fullWidth
                autoComplete='off'
                required
                multiline
                rows={2}
                id='subtitle'
                name='subtitle'
                label='Subtitle'
                value={formik.values.subtitle}
                onChange={formik.handleChange}
              />
            </FieldPaper>
          </Box>
          {formik.values.pages.map((page, index) => (
            <Box key={index}>
              <FieldPaper>
                <Editor
                  page={page}
                  index={index}
                  onChange={(value) => {
                    const pages = [...formik.values.pages];
                    pages[index] = value;
                    formik.setFieldValue('pages', pages);
                  }}
                  handleRemovePage={handleRemovePage}
                />
                <Box mt={2}>
                  <Typography variant='caption'>
                    Page {index + 1} of {formik.values.pages.length}
                  </Typography>
                </Box>
              </FieldPaper>
            </Box>
          ))}
          <Box>
            <Button
              onClick={handleAddPage}
              fullWidth
              variant='outlined'
              startIcon={<NoteAddIcon />}>
              Add Page
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditorForm;

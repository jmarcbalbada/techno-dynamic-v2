import React from 'react';
import { useFormik, FormikProvider, FieldArray, Field } from 'formik';

import Editor from './Editor';

import { Box } from '@mui/material';
import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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
      pages: [
        {
          contents: ''
        }
      ]
    }
  });

  const handleAddPage = (push) => {
    push({ contents: '' });

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 1);
  };

  const handleRemovePage = (remove, index) => {
    if (formik.values.pages.length === 1) {
      return;
    }

    remove(index);
  };

  return (
    <Container component='main'>
      <FormikProvider value={formik}>
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
            <FieldArray name='pages'>
              {({ insert, remove, push }) => (
                <Stack divider={<Divider flexItem />} spacing={2}>
                  {formik.values.pages.map((page, index) => (
                    <Box key={index}>
                      <FieldPaper>
                        <Field name={`pages.${index}.contents`}>
                          {({ field }) => (
                            <Box>
                              <Editor
                                field={field}
                                index={index}
                                contents={page.contents}
                                insert={() => insert(index, { contents: '' })}
                                remove={() => handleRemovePage(remove, index)}
                              />
                            </Box>
                          )}
                        </Field>
                        <Box mt={1}>
                          <Typography variant='caption'>
                            Page {index + 1} of {formik.values.pages.length}
                          </Typography>
                        </Box>
                      </FieldPaper>
                    </Box>
                  ))}
                  <Box>
                    <Button
                      fullWidth
                      onClick={() => handleAddPage(push)}
                      variant='outlined'
                      startIcon={<NoteAddIcon />}>
                      Add Page
                    </Button>
                  </Box>
                </Stack>
              )}
            </FieldArray>
          </Stack>
        </Box>
      </FormikProvider>
    </Container>
  );
};

export default EditorForm;

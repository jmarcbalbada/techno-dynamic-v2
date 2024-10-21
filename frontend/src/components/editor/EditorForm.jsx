import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

import { LessonsService } from 'apis/LessonsService';
import { BaseDetailsValidationSchema } from './BaseDetailsValidationSchema';
import BaseDetailsForm from './BaseDetailsForm';
import PagesList from './PagesList';
import DeleteLessonDialog from 'components/deleteDialog/DeleteLessonDialog';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ContentHistoryService } from 'apis/ContentHistoryService.js';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';

const EditorForm = ({ lesson, initialLessonNumber, isEdit = false }) => {
  const [pages, setPages] = useState(
    lesson ? lesson.pages : [{ contents: '' }]
  );
  const [files, setFiles] = useState(lesson ? lesson.lesson_files : []);
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [lessonId, setLessonId] = useState(null);
  const [versionInfo, setVersionInfo] = useState(null); // Store version info

  const navigate = useNavigate();

  useEffect(() => {
    const lessonIdLocalStorage = localStorage.getItem('ltids');
    if (lessonIdLocalStorage) {
      const parsedData = JSON.parse(lessonIdLocalStorage);
      setLessonId(+parsedData?.id); // Ensure ID is a number
      getCurrentVersionAndItsParentIfExist(+parsedData.id);
    }
  }, []);

  const getCurrentVersionAndItsParentIfExist = async (receivedId) => {
    try {
      const response =
        await ContentHistoryService.getCurrentVersionAndParent(receivedId);
      setVersionInfo(response.data); // Store the response in state
    } catch (error) {
      console.error(error);
    }
  };

  const formikBase = useFormik({
    initialValues: {
      lessonNumber: lesson ? lesson.lessonNumber : initialLessonNumber,
      title: lesson ? lesson.title : '',
      subtitle: lesson ? lesson.subtitle : '',
      coverImage: lesson ? (lesson.coverImage ? lesson.coverImage : null) : null
    },
    validationSchema: BaseDetailsValidationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('subtitle', values.subtitle);
        formData.append('lessonNumber', values.lessonNumber);
        formData.append('pages', JSON.stringify(pages));

        for (let file of files) {
          formData.append('lesson_files', file.file);
        }

        if (filesToDelete.length > 0) {
          formData.append('files_to_delete', JSON.stringify(filesToDelete));
        }

        if (values.coverImage instanceof File) {
          formData.append('coverImage', values.coverImage);
        } else if (lesson && lesson.coverImage) {
          if (values.coverImage !== lesson.coverImage) {
            formData.append('coverImage', lesson.coverImage);
          }
        }

        if (isEdit) {
          // Handle content history creation based on version info
          const content = pages.map((page) => page.contents).join('');

          if (versionInfo?.currentHistoryId) {
            if (versionInfo.parentHistoryId) {
              // If there is a parent, create a child version
              await ContentHistoryService.createHistoryWithParent(
                lessonId,
                content,
                versionInfo.parentHistoryId
              );
            } else {
              // If no parent, create a new parent version
              await ContentHistoryService.createHistoryWithParent(
                lessonId,
                content,
                versionInfo.currentHistoryId
              );
            }
          } else {
            // If no version exists, create a new history
            await ContentHistoryService.createHistory(lessonId, content);
          }
        }

        // If updating, call update endpoint
        if (lesson) {
          await LessonsService.update(lesson.id, formData);
        } else {
          await LessonsService.create(formData);
        }

        navigate(-1, { replace: true });
      } catch (error) {
        console.log('Error:', error);
      }
    }
  });

  const handleUploadFiles = (event) => {
    const uploadedFiles = event.currentTarget.files;
    const uploadedFilesArray = Array.from(uploadedFiles).map((file) => ({
      lesson: lesson?.lessonNumber || initialLessonNumber,
      file: file
    }));

    const newFiles = uploadedFilesArray.filter((fileObj) => !fileObj.id);
    setFiles((existingFiles) => [...existingFiles, ...newFiles]);
  };

  const handleDeleteFile = (fileToDelete) => {
    setFiles((files) => files.filter((file) => file !== fileToDelete));

    if (fileToDelete.id) {
      setFilesToDelete((prevFilesToDelete) => [
        ...prevFilesToDelete,
        fileToDelete.id
      ]);
    }
  };

  const handleClose = useCallback(() => {
    const confirmed = window.confirm(
      'Are you sure you want to go back to the dashboard? Any unsaved changes will be lost.'
    );
    if (confirmed) {
      navigate('/', { replace: true });
    }
  }, []);

  const handleDialogOpen = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleDialogDelete = useCallback(async () => {
    try {
      await LessonsService.delete(lesson.id);
      navigate('/', { replace: true });
    } catch (error) {
      console.log('Error:', error);
    }
  }, []);

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const confirmNavigation = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return 'You have unsaved changes. Are you sure you want to leave this page?';
    };

    window.addEventListener('beforeunload', confirmNavigation);

    return () => {
      window.removeEventListener('beforeunload', confirmNavigation);
    };
  }, []);

  return (
    <Container component='main'>
      <Box component='form' onSubmit={formikBase.handleSubmit} my={4}>
        <Stack divider={<Divider flexItem />} spacing={2}>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h4'>
              {lesson
                ? `Editing Lesson ${lesson.lessonNumber}`
                : 'Create a New Lesson'}
            </Typography>
            <Button onClick={handleClose} endIcon={<CloseIcon />}>
              Dashboard
            </Button>
          </Box>
          <Box mt={4}>
            <BaseDetailsForm
              formikBase={formikBase}
              files={files}
              handleUploadFiles={handleUploadFiles}
              handleDeleteFile={handleDeleteFile}
            />
          </Box>
          <Box mt={4}>
            <PagesList pages={pages} setPages={setPages} />
          </Box>
          <Box>
            <Button type='submit' fullWidth size='large' variant='contained'>
              {lesson ? 'Save Changes' : 'Create Lesson'}
            </Button>
          </Box>
          {lesson && (
            <Paper
              variant='outlined'
              sx={{
                mt: 3,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'rgba(235, 0, 20, 0.1)',
                borderColor: 'error.main'
              }}>
              <Box sx={{ m: 3 }}>
                <Box>
                  <Typography variant='h6' display='flex' alignItems='center'>
                    <WarningIcon color='error' sx={{ mr: 0.5 }} />
                    Delete this lesson?
                  </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Button
                    onClick={handleDialogOpen}
                    color='error'
                    variant='outlined'>
                    Yes, delete it!
                  </Button>
                  {openDialog && (
                    <DeleteLessonDialog
                      open={openDialog}
                      handleClose={handleDialogClose}
                      handleDelete={() => handleDialogDelete()}
                    />
                  )}
                </Box>
              </Box>
            </Paper>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default EditorForm;

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ContentHistoryService } from 'apis/ContentHistoryService.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import RestoreIcon from '@mui/icons-material/Restore';
import Snackbar from '@mui/material/Snackbar';
import { SnackBarAlert } from 'components/common/SnackbarAlert/SnackbarAlert';
import VersionHistoryLayout from './VersionHistoryLayout';

const VersionHistory = () => {
  const lessonAndTitleIds = JSON.parse(localStorage.getItem('ltids'));
  const lessonId = lessonAndTitleIds?.id;
  const [isError, setIsError] = useState(false);
  const [histories, setHistories] = useState([]); // Default to an empty array
  const [currentLesson, setCurrentLesson] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [expandedChild, setExpandedChild] = useState(false);
  const lessonTitle = lessonAndTitleIds?.title || 'Your lesson';
  const lessonNumber = lessonAndTitleIds?.lessonNumber;
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const navigate = useNavigate();
  const timer = 1500;
  const theme = useTheme();

  useEffect(() => {
    getHistoryLessonByLessonId();
  }, []);

  const getHistoryLessonByLessonId = async () => {
    try {
      const response =
        await ContentHistoryService.getHistoryByLessonId(lessonId);
      console.log('response', response.data);

      const fetchedHistories = response.data.content_histories || [];
      const fetchedCurrentLesson = response.data.current_lesson || '';

      setHistories(fetchedHistories);
      setCurrentLesson(fetchedCurrentLesson);
    } catch (error) {
      setIsError(true);
      console.error(error);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleRestoreButton = async (lesson_id = lessonId, history_id) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to restore this version? You won't be able to revert to the current version afterward."
      );

      if (confirmation) {
        const response = await ContentHistoryService.restoreHistory(
          lesson_id,
          history_id
        );

        if (response.status === 200) {
          const restoredContent = histories.find(
            (history) => history.historyId === history_id
          )?.content;

          setCurrentLesson(restoredContent);
          setExpanded(false);
          setSnackbarSuccessOpen(true);
        } else {
          alert('Failed to restore version.');
        }
        return response;
      } else {
        alert('Restore action canceled.');
      }
    } catch (error) {
      setIsError(true);
      console.error('Error while restoring version:', error);
      alert('An error occurred while trying to restore the version.');
    }
  };

  const handleSnackbarSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarSuccessOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Invalid Date'; // Fallback if date is missing
    }

    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid Date'; // Fallback if date is invalid
    }

    return format(date, "MMMM dd, yyyy 'at' hh:mm a");
  };

  // Function to recursively render children inside the parent accordion
  const renderChildren = (children) => {
    return (
      children &&
      children.map((child) => {
        const isChildCurrentVersion = currentLesson === child.content;

        return (
          <Accordion
            key={child.historyId}
            expanded={expandedChild === `panel${child.historyId}`}
            onChange={(event, isExpanded) =>
              setExpandedChild(isExpanded ? `panel${child.historyId}` : false)
            }
            sx={{ ml: 4, mt: 2, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.35)' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${child.historyId}-content`}
              id={`panel${child.historyId}-header`}>
              <Box width='100%' display='flex' justifyContent='space-between'>
                <Box display='flex'>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: `${theme.palette.background.darker}`
                    }}>
                    Child Version {child.version}
                  </Typography>
                  {isChildCurrentVersion && (
                    <Typography
                      color='primary'
                      sx={{ fontWeight: 500, marginLeft: '0.5rem' }}>
                      - Current Version
                    </Typography>
                  )}
                </Box>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'>
                  {!isChildCurrentVersion && (
                    <Box
                      display='flex'
                      alignItems='center'
                      sx={{
                        color: `${theme.palette.primary.main}`,
                        zIndex: 10,
                        cursor: 'pointer'
                      }}
                      onClick={() =>
                        handleRestoreButton(lessonId, child.historyId)
                      }>
                      <RestoreIcon />
                      <Typography sx={{ ml: 0.8 }}>Restore</Typography>
                    </Box>
                  )}
                  <Typography sx={{ fontStyle: 'italic', mr: 1, ml: 3 }}>
                    {formatDate(child.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography dangerouslySetInnerHTML={{ __html: child.content }} />
            </AccordionDetails>
          </Accordion>
        );
      })
    );
  };

  // Function to render the main parent history
  // Function to render the main parent history
  const renderHistory = (history) => {
    const isCurrentVersion = currentLesson === history.parent_history?.content;
    const updatedAt = history.parent_history
      ? history.parent_history.updatedAt
      : null;

    // Check if one of the children has the current lesson content
    const isChildCurrent = history.children?.some(
      (child) => currentLesson === child.content
    );

    return (
      <Accordion
        sx={{
          boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.35)'
        }}
        key={history.parent_history?.historyId}
        expanded={expanded === `panel${history.parent_history?.historyId}`}
        onChange={handleAccordionChange(
          `panel${history.parent_history?.historyId}`
        )}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${history.parent_history?.historyId}-content`}
          id={`panel${history.parent_history?.historyId}-header`}>
          <Box
            width='100%'
            display='flex'
            justifyContent='space-between'
            alignItems='center'>
            <Box display='flex' alignItems='center'>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: `${theme.palette.background.darker}`
                }}
                variant='h6'>
                Version {history.parent_history?.version}
              </Typography>

              {isCurrentVersion && (
                <Typography
                  component='span'
                  color='primary'
                  sx={{ fontWeight: 500, ml: 1 }}>
                  - (Current Version)
                </Typography>
              )}

              {!isCurrentVersion && isChildCurrent && (
                <Typography
                  component='span'
                  color='primary'
                  sx={{ fontWeight: 500, ml: 1 }}>
                  - (The child under this version is the current)
                </Typography>
              )}
            </Box>

            <Box
              display='flex'
              alignItems='center'
              sx={{
                color: `${theme.palette.primary.main}`,
                zIndex: 10,
                cursor: 'pointer'
              }}>
              {!isCurrentVersion && !isChildCurrent && (
                <Box
                  display='flex'
                  alignItems='center'
                  onClick={() =>
                    handleRestoreButton(
                      lessonId,
                      history.parent_history.historyId
                    )
                  }>
                  <RestoreIcon />
                  <Typography sx={{ ml: 0.8 }}>Restore</Typography>
                </Box>
              )}
              <Typography sx={{ fontStyle: 'italic', ml: 2 }}>
                {formatDate(updatedAt)}
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          {history.parent_history && history.parent_history.content ? (
            <Typography
              dangerouslySetInnerHTML={{
                __html: history.parent_history.content
              }}
            />
          ) : (
            <Typography color='error'>Content not available</Typography>
          )}

          {history.children && history.children.length > 0 ? (
            <>
              <Box
                sx={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: theme.palette.background.darker,
                  marginBottom: '1.3rem'
                }}
              />
              <Typography
                sx={{
                  fontWeight: 600,
                  color: `${theme.palette.background.darker}`
                }}
                variant='h6'>
                Children Versions
              </Typography>
              {renderChildren(history.children)}{' '}
              {/* Only render children here */}
            </>
          ) : (
            <>
              <Box
                sx={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: theme.palette.background.darker,
                  marginBottom: '8px'
                }}
              />
              <Typography
                sx={{
                  fontWeight: 400,
                  color: `${theme.palette.background.darker}`
                }}
                variant='h7'>
                This version has no children.
              </Typography>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Container>
      <VersionHistoryLayout />
      <Box
        sx={{
          marginTop: '1rem',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'start',
          alignContent: 'center'
        }}>
        <Breadcrumbs aria-label='breadcrumb'>
          <Link
            underline='hover'
            color='inherit'
            onClick={() =>
              navigate(`/lessons/${lessonNumber}/1/false/${lessonId}`)
            }
            sx={{ cursor: 'pointer' }}>
            {lessonTitle}
          </Link>
          <Link
            underline='hover'
            color={theme.palette.background.neutral}
            onClick={() => window.location.reload()}
            sx={{ cursor: 'pointer', fontWeight: 600 }}>
            Version Control
          </Link>
        </Breadcrumbs>
      </Box>
      <Box mb={2}>
        {isError ? (
          <Typography color='error'>Error loading content history</Typography>
        ) : (
          <>
            {Array.isArray(histories) && histories.length > 0 ? (
              histories
                .slice() // Create a copy to avoid modifying the original array
                .reverse() // Reverse the array to show the latest first
                .map((history) => renderHistory(history)) // Render parent/children structure recursively
            ) : (
              <Typography>No version history available</Typography>
            )}
          </>
        )}
      </Box>

      <Snackbar
        open={snackbarSuccessOpen}
        autoHideDuration={timer}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleSnackbarSuccessClose}>
        <SnackBarAlert
          onClose={handleSnackbarSuccessClose}
          severity='success'
          sx={{ width: '100%' }}>
          Restored successfully!
        </SnackBarAlert>
      </Snackbar>
    </Container>
  );
};

export default VersionHistory;

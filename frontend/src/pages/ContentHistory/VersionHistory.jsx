import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ContentHistoryService } from 'apis/ContentHistoryService.js';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RestoreIcon from '@mui/icons-material/Restore';
import Snackbar from '@mui/material/Snackbar';
import { SnackBarAlert } from 'components/common/SnackbarAlert/SnackbarAlert';
import VersionHistoryLayout from './VersionHistoryLayout';
import { CleanMarkAiContent } from '../../helpers/CleanMarkAiContent';

const VersionHistory = () => {
  const lessonAndTitleIds = JSON.parse(localStorage.getItem('ltids'));
  const lessonId = lessonAndTitleIds?.id;
  const [isError, setIsError] = useState(false);
  const [histories, setHistories] = useState([]);
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
      // console.log('response', response.data);
      const fetchedHistories = response.data.content_histories || [];
      const fetchedCurrentLesson = CleanMarkAiContent(
        response.data.current_lesson || ''
      );

      // Clean the content of each parent and child
      const cleanedHistories = fetchedHistories.map((history) => ({
        ...history,
        parent_history: {
          ...history.parent_history,
          content: CleanMarkAiContent(history.parent_history?.content || '')
        },
        children: history.children?.map((child) => ({
          ...child,
          content: CleanMarkAiContent(child.content || '')
        }))
      }));

      setHistories(cleanedHistories);
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
          // Reset expanded state to close all accordions
          setExpanded(false);
          setExpandedChild(false);

          // Reload history to reflect changes
          await getHistoryLessonByLessonId();

          // Open a success snackbar
          setSnackbarSuccessOpen(true);
        } else {
          alert('Failed to restore version.');
        }
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

  // Remove <!-- delimiter --> from content for comparison
  const cleanContent = (content) => {
    return content?.replace(/<!-- delimiter -->/g, '').trim();
  };

  const isCurrentLessonInVersions = histories.some(
    (history) =>
      cleanContent(history.parent_history?.content) ===
        cleanContent(currentLesson) ||
      history.children?.some(
        (child) => cleanContent(child.content) === cleanContent(currentLesson)
      )
  );

  const renderCurrentLessonAccordion = () => (
    <Accordion
      expanded={expanded === 'currentLesson'}
      onChange={handleAccordionChange('currentLesson')}
      sx={{
        boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.35)',
        marginBottom: '1rem'
      }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='currentLesson-content'
        id='currentLesson-header'>
        <Typography
          sx={{
            fontWeight: 600,
            color: `${theme.palette.primary.main}`,
            mr: '0.3rem'
          }}
          variant='h6'>
          Current Lesson
        </Typography>
        <Tooltip title='This lesson is not in any of your versions.'>
          <HelpOutlineIcon
            sx={{ color: 'green', fontSize: '1.0rem', marginTop: '0.3rem' }}
          />
        </Tooltip>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          dangerouslySetInnerHTML={{
            __html: CleanMarkAiContent(currentLesson)
          }}
        />
      </AccordionDetails>
    </Accordion>
  );

  const renderChildren = (children) => {
    return (
      children &&
      children.map((child) => {
        const isChildCurrentVersion =
          cleanContent(currentLesson) === cleanContent(child.content);

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
                    Version {child.version}
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
              <Typography
                dangerouslySetInnerHTML={{
                  __html: CleanMarkAiContent(child.content)
                }}
              />
            </AccordionDetails>
          </Accordion>
        );
      })
    );
  };

  const renderHistory = (history) => {
    const isCurrentVersion =
      cleanContent(currentLesson) ===
      cleanContent(history.parent_history?.content);
    const updatedAt = history.parent_history
      ? history.parent_history.updatedAt
      : null;
    const isChildCurrent = history.children?.some(
      (child) => cleanContent(currentLesson) === cleanContent(child.content)
    );

    return (
      <Accordion
        sx={{ boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.35)' }}
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
                  - Current Version
                </Typography>
              )}

              {!isCurrentVersion && isChildCurrent && (
                <Typography
                  component='span'
                  color='primary'
                  sx={{ fontWeight: 500, ml: 1 }}>
                  - Child version is active
                </Typography>
              )}
            </Box>
            <Box display='flex' alignItems='center'>
              {/* Show the Restore button if it's not the current version OR if it's the child current */}
              {!isCurrentVersion && (
                <Box
                  display='flex'
                  alignItems='center'
                  sx={{
                    cursor: 'pointer',
                    color: `${theme.palette.primary.main}`
                  }}
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
                __html: CleanMarkAiContent(history.parent_history.content)
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
              {renderChildren(history.children)}
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
            {!isCurrentLessonInVersions && renderCurrentLessonAccordion()}
            {Array.isArray(histories) && histories.length > 0 ? (
              histories
                .slice()
                .reverse()
                .map((history) => renderHistory(history))
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

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

const VersionHistory = () => {
  const lessonAndTitleIds = JSON.parse(localStorage.getItem('ltids'));
  const lessonId = lessonAndTitleIds?.id;
  const [isError, setIsError] = useState(false);
  const [histories, setHistories] = useState([]);
  const [currentLesson, setCurrentLesson] = useState('');
  const [expanded, setExpanded] = useState(false);
  const lessonTitle = lessonAndTitleIds?.title || 'Your lesson';
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
      // console.log('response history', response.data);

      setHistories(response.data.content_history);
      setCurrentLesson(response.data.current_lesson);
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
        `Are you sure you want to restore this version? You won't be able to revert to the current version afterward.`
      );

      if (confirmation) {
        const response = await ContentHistoryService.restoreHistory(
          lesson_id,
          history_id
        );

        if (response.status === 200) {
          // Get the restored content from the selected history
          const restoredContent = histories.find(
            (history) => history.historyId === history_id
          )?.content;

          // Set the restored content as the current lesson
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

  // Format the date as "Month Day, Year at 11:59 PM"
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM dd, yyyy 'at' hh:mm a");
  };

  // Function to check if the current version matches any history content
  const currentVersionFound = histories.some(
    (history) => currentLesson === history.content
  );

  // Function to truncate the lesson title if it's too long
  const truncateTitle = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  };

  return (
    <Container>
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
            onClick={() => navigate(-1)}
            sx={{ cursor: 'pointer' }}>
            {truncateTitle(lessonTitle, 30)}
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
            {/* Iterate through the content history in descending order */}
            {histories
              .slice() // Create a copy to avoid modifying the original array
              .reverse() // Reverse the array to show latest first
              .map((history, index) => {
                const isCurrentVersion = currentLesson === history.content;

                return (
                  <Accordion
                    key={history.historyId}
                    expanded={expanded === `panel${history.historyId}`}
                    onChange={handleAccordionChange(
                      `panel${history.historyId}`
                    )}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${history.historyId}-content`}
                      id={`panel${history.historyId}-header`}>
                      {/* Container for Version and RestoreIcon aligned horizontally */}
                      <Box width='100%'>
                        <Box
                          display='flex'
                          justifyContent='space-between'
                          alignItems='center'
                          sx={{
                            paddingRight: '1rem'
                          }}
                          width='97%'>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: `${theme.palette.background.darker}`
                            }}
                            variant='h5'>
                            Version {history.version}
                          </Typography>
                          <Box
                            display='flex'
                            alignItems='center'
                            sx={{
                              ml: 2,
                              color: `${theme.palette.primary.main}`,
                              zIndex: 10,
                              cursor: isCurrentVersion
                                ? 'not-allowed'
                                : 'pointer',
                              pointerEvents: isCurrentVersion ? 'none' : 'auto'
                            }}
                            onClick={() =>
                              !isCurrentVersion &&
                              handleRestoreButton(lessonId, history.historyId)
                            }>
                            {' '}
                            {!isCurrentVersion && (
                              <>
                                <RestoreIcon />
                                <Typography sx={{ ml: 0.8 }}>
                                  Restore
                                </Typography>{' '}
                              </>
                            )}
                          </Box>
                        </Box>

                        <Typography
                          sx={{
                            fontStyle: 'italic',
                            mt: 1
                          }}>
                          {formatDate(history.updatedAt)}
                        </Typography>

                        {/* Optional: Display if it's the current version */}
                        {isCurrentVersion && (
                          <Typography
                            component='span'
                            color='primary'
                            sx={{ fontWeight: 500 }}>
                            (Current Version)
                          </Typography>
                        )}
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Typography
                        dangerouslySetInnerHTML={{ __html: history.content }}
                      />
                      {isCurrentVersion && (
                        <Typography variant='caption' color='textSecondary'>
                          This is the current version.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })}

            {/* If no version matches the currentLesson, show an additional accordion */}
            {!currentVersionFound && (
              <Accordion key={'current-version'}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-current-version-content`}
                  id={`panel-current-version-header`}>
                  <Typography
                    sx={{
                      color: `${theme.palette.primary.main}`,
                      fontWeight: 600
                    }}
                    variant='body3'>
                    Version {histories.length + 1} - Current Version
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    dangerouslySetInnerHTML={{ __html: currentLesson }}
                  />
                </AccordionDetails>
              </Accordion>
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
          sx={{
            width: '100%'
          }}>
          Restored successfully!
        </SnackBarAlert>
      </Snackbar>
    </Container>
  );
};

export default VersionHistory;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { LessonsService } from 'apis/LessonsService';
import { SuggestionService } from 'apis/SuggestionService';
import LessonPage from 'components/lessonpage/LessonPage';
import FooterControls from 'components/lessonpage/FooterControls';
import FilesModal from 'components/lessonpage/FilesModal';
import ChatbotDialog from 'components/lessonpage/ChatbotDialog';
import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import { useAuth } from '../../hooks/useAuth';
import { Tooltip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import ChatIcon from '@mui/icons-material/Chat';
import NotificationLayout from '../Notification/NotificationLayout';
import InsightLayout from '../Insight/InsightLayout';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import { encryptValue, decryptValue } from '../../helpers/EncryptDecryptor';

const Lesson = () => {
  const { lessonNumber, pageNumber, isNotif, isInsight, lessonID } =
    useParams();
  const convertInsight = isInsight === 'true';
  const decodedIsNotif = decodeURIComponent(isNotif);
  const decryptedNotif = decryptValue(decodedIsNotif);
  console.log('Decrypted: ', decryptedNotif);
  const [insight, setInsight] = useState(convertInsight);
  const notif = decryptedNotif === 'true';
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber));
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lessonInsights, setLessonInsights] = useState([]);
  const { user } = useAuth();
  const [notifIdAuth, setNotifIdAuth] = useState(false);
  const [footerHeight, setFooterHeight] = useState(100);
  const currID = parseInt(lessonID);
  const theme = useTheme();
  const [suggestionLoading, setSuggestionLoading] = useState(true);

  useEffect(() => {
    getLessonLessonNumber(lessonNumber);
  }, []);

  const suggestClick = () => {
    // console.log('suggest clicked');
    navigate(`/suggest/${lessonNumber}/1/${currID}`);
  };

  const insightClicked = () => {
    // console.log('insight clicked');
    getSuggestionInsights(currID);
    setInsight(true);
  };

  const getLessonLessonNumber = async (lessonNumber) => {
    try {
      const response = await LessonsService.getByLessonNumber(lessonNumber);
      // console.log('response', response.data);
      localStorage.setItem(
        'ltids',
        JSON.stringify({
          id: response?.data?.id,
          lessonNumber: lessonNumber,
          title: response?.data?.title
        })
      );
      setLesson(response.data);
    } catch (error) {
      console.log('error', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestionInsights = async () => {
    try {
      setSuggestionLoading(true); // Start loading
      const notif_id = localStorage.getItem('notification_id');
      if (notif_id) {
        const response = await SuggestionService.create_insights(
          currID,
          notif_id
        );
        setLessonInsights(
          '<i>' +
            response.data.faq_questions +
            '</i><hr>' +
            response.data.suggestion.insights
        );
      }
    } catch (error) {
      console.log('error', error);
      setIsError(true);
    } finally {
      setSuggestionLoading(false); // Loading is done
    }
  };

  const handleNextPage = () => {
    if (currentPage < lesson?.pages?.length) {
      setCurrentPage((prev) => prev + 1);
      navigate(
        `/lessons/${lessonNumber}/${currentPage + 1}/${isNotif}/${lessonID}`
      );
      // navigate(`/lessons/${lessonNumber}/${currentPage + 1}`);
    } else if (notif) {
      // navigate(`/`);
      alert('This is the last page of the lesson! Please review to continue!');
    } else {
      navigate(`/lessons/${lessonNumber}/end`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      navigate(
        `/lessons/${lessonNumber}/${currentPage - 1}/${isNotif}/${lessonID}`
      );
    } else {
      navigate(`/`);
    }
  };

  const handleEditPage = () => {
    navigate(`/lessons/${lessonNumber}/edit`);
  };

  const handleOpenFiles = () => {
    setFileModalOpen(true);
  };

  const handleCloseFiles = () => {
    setFileModalOpen(false);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        {user.role === 'teacher' && !notif && (
          <Box
            sx={{
              position: {
                xs: 'relative',
                sm: 'relative',
                md: 'relative',
                lg: 'relative',
                xl: 'absolute'
              },
              top: {
                xs: '0',
                sm: '0'
              },
              left: {
                xs: '1.0rem',
                sm: '1.6rem',
                md: '1.6rem',
                xl: '1.6rem'
              },
              mt: {
                xs: 0,
                sm: 5
              },
              zIndex: 10,
              pointerEvents: 'auto'
            }}>
            <Typography
              variant='body2'
              align='left'
              sx={{
                display: 'inline-block',
                mt: 2,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 16
              }}>
              <Link
                color={theme.palette.primary.main}
                href={`/lessons/history/${lessonID}`}>
                View Version History
              </Link>
              <Tooltip
                title={
                  <>
                    <Typography variant='body1'>Version Control</Typography>
                    <Typography variant='body2'>
                      Quickly access and restore previous versions.
                    </Typography>
                  </>
                }>
                <AutoAwesomeIcon
                  sx={{
                    color: '#4c80d4',
                    fontSize: '1.0rem',
                    marginLeft: '10px'
                  }}
                />
              </Tooltip>
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Container
            component='main'
            sx={{
              mb: 12
            }}>
            {isLoading ? (
              <div>Loading...</div>
            ) : isError ? (
              <div>Error, something went wrong!</div>
            ) : (
              <>
                {notif && !insight && user.role === 'teacher' && (
                  <NotificationLayout
                    handleSuggest={suggestClick}
                    handleInsight={() => insightClicked(currID)}
                  />
                )}
                {insight && (
                  <InsightLayout
                    suggestionLoading={suggestionLoading}
                    handleSuggest={suggestClick}
                    sampleContentReal={
                      lessonInsights.length > 0
                        ? lessonInsights
                        : '<h4><i>Please wait...<i/><h4/>'
                    }
                  />
                )}
                <LessonPage
                  pageContent={lesson?.pages[currentPage - 1]?.contents}
                />
                <FilesModal
                  files={lesson?.lesson_files}
                  open={fileModalOpen}
                  handleClose={handleCloseFiles}
                />
                {user.role === 'student' && (
                  <>
                    {/* Fab Button */}
                    <Fab
                      color='primary'
                      onClick={handleOpenChat}
                      sx={{
                        position: 'fixed',
                        bottom: `${footerHeight + 20}px`, // Dynamically adjust Fab position based on Footer height
                        right: '50px',
                        zIndex: 1200 // Ensure it's above FooterControls
                      }}>
                      <ChatIcon />
                    </Fab>

                    {/* Chatbot Dialog */}
                    <ChatbotDialog
                      open={isChatOpen}
                      handleClose={handleCloseChat}
                      lessonId={lesson.id}
                      pageId={lesson?.pages[currentPage - 1]?.id}
                      sx={{
                        zIndex: 5000 // Keep ChatbotDialog higher than FooterControls but below Fab
                      }}
                    />
                  </>
                )}
              </>
            )}
          </Container>

          {!isChatOpen && (
            <FooterControls
              isFirstPage={currentPage === 1}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              handleEditPage={handleEditPage}
              handleOpenFiles={handleOpenFiles}
              setFooterHeight={setFooterHeight} // This callback receives the footer height
            />
          )}
          {/* <FooterControls
            isFirstPage={currentPage === 1}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            handleEditPage={handleEditPage}
            handleOpenFiles={handleOpenFiles}
            setFooterHeight={setFooterHeight} // This callback receives the footer height
          /> */}
        </Box>
      </Box>
    </>
  );
};

export default Lesson;

import React, { useEffect, useState } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';

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

import ChatIcon from '@mui/icons-material/Chat';
import NotificationLayout from '../Notification/NotificationLayout';
import InsightLayout from '../Insight/InsightLayout';
import Skeleton from '@mui/material/Skeleton';

const Lesson = () => {
  const { lessonNumber, pageNumber, isNotif, isInsight, lessonID } =
    useParams();
  const convertInsight = isInsight === 'true';
  const [insight, setInsight] = useState(convertInsight);
  const notif = isNotif === 'true';
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber));
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lessonInsights, setLessonInsights] = useState([]);
  const { user } = useAuth();
  const currID = parseInt(lessonID);

  useEffect(() => {
    getLessonLessonNumber(lessonNumber);
    // console.log('LESSONID', currID);
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
      console.log('response', response.data);
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
      navigate(`/`);
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
    <Box>
      <Container
        component='main'
        sx={{
          mt: 2,
          mb: 12
        }}>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>error</div>
        ) : (
          // <Navigate to="/404" replace />
          <>
            {notif && !insight && user.role == 'teacher' && (
              <NotificationLayout
                handleSuggest={suggestClick}
                handleInsight={() => insightClicked(currID)}
              />
            )}
            {insight && (
              <InsightLayout
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
            <Fab
              color='primary'
              onClick={handleOpenChat}
              sx={{
                position: 'fixed',
                bottom: '100px',
                right: '50px'
              }}>
              <ChatIcon />
            </Fab>
            <ChatbotDialog
              open={isChatOpen}
              handleClose={handleCloseChat}
              lessonId={lesson.id}
              pageId={lesson?.pages[currentPage - 1]?.id}
            />
          </>
        )}
      </Container>
      <FooterControls
        isFirstPage={currentPage === 1}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleEditPage={handleEditPage}
        handleOpenFiles={handleOpenFiles}
      />
    </Box>
  );
};

export default Lesson;

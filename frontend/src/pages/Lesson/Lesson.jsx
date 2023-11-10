import React, { useEffect, useState } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';

import { LessonsService } from 'apis/LessonsService';
import LessonPage from 'components/lessonpage/LessonPage';
import FooterControls from 'components/lessonpage/FooterControls';
import FilesModal from 'components/lessonpage/FilesModal';
import ChatbotDialog from 'components/lessonpage/ChatbotDialog';

import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';

import ChatIcon from '@mui/icons-material/Chat';

const Lesson = () => {
  const { lessonNumber, pageNumber } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber));
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getLessonLessonNumber(lessonNumber);
  }, []);

  const getLessonLessonNumber = async (lessonNumber) => {
    try {
      const response = await LessonsService.getByLessonNumber(lessonNumber);
      setLesson(response.data);
      console.log('response.data', response.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < lesson?.pages?.length) {
      setCurrentPage((prev) => prev + 1);
      navigate(`/lessons/${lessonNumber}/${currentPage + 1}`);
    } else {
      navigate(`/lessons/${lessonNumber}/end`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      navigate(`/lessons/${lessonNumber}/${currentPage - 1}`);
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
          <Navigate to='/404' replace />
        ) : (
          <>
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

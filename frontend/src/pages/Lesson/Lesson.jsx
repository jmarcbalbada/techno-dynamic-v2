import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { LessonsService } from 'apis/LessonsService';
import LessonPage from 'components/lessonpage/LessonPage';
import FooterControls from 'components/lessonpage/FooterControls';

import { Box } from '@mui/material';
import Container from '@mui/material/Container';

const Lesson = () => {
  const { lessonNumber, pageNumber } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber));
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getLessonLessonNumber(lessonNumber);
  }, []);

  const getLessonLessonNumber = async (lessonNumber) => {
    try {
      const response = await LessonsService.getByLessonNumber(lessonNumber);
      setLesson(response.data);
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
          <div>Something went wrong, Please Try Again Later.</div>
        ) : (
          <LessonPage pageContent={lesson?.pages[currentPage - 1]?.contents} />
        )}
      </Container>
      <FooterControls
        isFirstPage={currentPage === 1}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleEditPage={handleEditPage}
      />
    </Box>
  );
};

export default Lesson;

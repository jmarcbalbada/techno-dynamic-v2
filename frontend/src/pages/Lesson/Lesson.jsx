import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { LessonsService } from 'apis/LessonsService';
import LessonPage from 'components/lessonpage/LessonPage';
import FooterControls from 'components/lessonpage/FooterControls';

import { Box } from '@mui/material';
import Container from '@mui/material/Container';

const Lesson = () => {
  const { lessonid, pageNumber } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber));
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getLessonById(lessonid);
  }, []);

  const getLessonById = async (id) => {
    try {
      const response = await LessonsService.getById(id);
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
      navigate(`/lessons/${lessonid}/${currentPage + 1}`);
    } else {
      navigate(`/lessons/${lessonid}/end`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      navigate(`/lessons/${lessonid}/${currentPage - 1}`);
    } else {
      navigate(`/`);
    }
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
      />
    </Box>
  );
};

export default Lesson;

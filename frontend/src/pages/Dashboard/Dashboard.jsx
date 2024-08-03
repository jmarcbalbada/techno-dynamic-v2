import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from 'hooks/useAuth';
import { LessonsService } from 'apis/LessonsService';
import CourseDetails from 'components/dashboard/CourseDetails';
import LessonCard from 'components/dashboard/LessonCard';
import useTitle from 'hooks/useTitle';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import AddIcon from '@mui/icons-material/Add';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import NotificationMessageLayout from '../Notification/NotificationMessageLayout';
import { FaqService } from '../../apis/FaqService';

const Dashboard = () => {
  useTitle('Dashboard');
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [faq, setFaq] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getLessons();
    // getFaq();
  }, []);

  const getLessons = async () => {
    try {
      const response = await LessonsService.list();
      if (response) {
        // console.log(response.data)
        setLessons(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFaq = async () => {
    try {
      const response = await FaqService.count_faq();
      if (response) {
        setFaq(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddLesson = () => {
    navigate('/create');
  };

  const handleViewQuery = () => {
    navigate('/queries'); // Navigate to the queries page when the button is clicked
  };

  return (
    <Container>
      <h1>Dashboard</h1>
      {/* <NotificationMessageLayout/> */}
      <Box>
        <CourseDetails />
      </Box>
      <Box my={4}>
        <Grid container spacing={3}>
          {user?.role === 'teacher' && (
            <>
              <Grid item xs={12} md={6}>
                <Button
                  onClick={handleAddLesson}
                  variant='contained'
                  size='large'
                  startIcon={<AddIcon />}
                  // TODO: add color from palette
                  fullWidth
                  sx={{
                    height: '100px',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
                  }}>
                  Add A New Lesson
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  // TODO: add onClick for query
                  //onClick={handleAddLesson}
                  onClick={handleViewQuery} // Call handleViewQueries function when the button is clicked
                  variant='contained'
                  color='secondary'
                  size='large'
                  startIcon={<QueryStatsIcon />}
                  // TODO: add color from palette
                  fullWidth
                  sx={{
                    height: '100px',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
                  }}>
                  View Queries
                </Button>
              </Grid>
            </>
          )}
          {lessons.map((lesson, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              {/*{lesson.coverImage}*/}

              <LessonCard
                id={lesson.id}
                lessonNumber={lesson.lessonNumber}
                title={lesson.title}
                description={lesson.subtitle}
                pageCount={lesson.pages.length}
                image={lesson.coverImage}
                fileCount={lesson.lesson_files.length}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;

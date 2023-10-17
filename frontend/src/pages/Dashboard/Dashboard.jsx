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

// TODO: change hardcoded lessons to actual lessons
const lessonsHardCode = [
  {
    image: 'https://source.unsplash.com/random/featured/?working,office'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?working'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?office'
  }
];

const Dashboard = () => {
  useTitle('Dashboard');
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getLessons();
  }, []);

  const getLessons = async () => {
    try {
      const response = await LessonsService.list();
      if (response) {
        setLessons(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddLesson = () => {
    navigate('/create');
  };

  return (
    <Container>
      <h1>Dashboard</h1>
      <Box>
        <CourseDetails />
      </Box>
      <Box my={4}>
        <Grid container spacing={3}>
          {user?.role === 'teacher' && (
            <Grid item xs={12}>
              <Button
                onClick={handleAddLesson}
                variant='outlined'
                size='large'
                startIcon={<AddIcon />}
                // TODO: add color from palette
                fullWidth>
                Add A New Lesson
              </Button>
            </Grid>
          )}
          {lessons.map((lesson, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <LessonCard
                id={lesson.id}
                lessonNumber={lesson.lessonNumber}
                title={lesson.title}
                description={lesson.subtitle}
                image={
                  lessonsHardCode[index % 3]?.image
                    ? lessonsHardCode[index % 3].image
                    : 'https://source.unsplash.com/random/featured/?working,office'
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;

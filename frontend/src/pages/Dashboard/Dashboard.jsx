import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from 'hooks/useAuth';
import { LessonsService } from 'apis/LessonsService';
import CourseDetails from 'components/dashboard/CourseDetails';
import LessonCard from 'components/dashboard/LessonCard';
import useTitle from 'hooks/useTitle';

import Box from '@mui/material/Box';
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
  console.log('user', user);
  const [lessons, setLessons] = useState([]);

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

  return (
    <Container>
      <h1>Dashboard</h1>
      <Box>
        <CourseDetails />
      </Box>
      <Box my={4}>
        <Grid container spacing={3}>
          {/* TODO: change hardcoded teacher string to user.role */}
          {user?.role === 'teacher' && (
            <Grid item xs={12}>
              <Button
                // TODO: add onClick handler to navigate to add lesson page
                variant='outlined'
                size='large'
                startIcon={<AddIcon />}
                // TODO: add color from palette
                fullWidth>
                Add A New Lesson
              </Button>
            </Grid>
          )}
          {/* TODO: change hardcoded lessoncards to actual lessons */}
          {lessons.map((lesson, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <LessonCard
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

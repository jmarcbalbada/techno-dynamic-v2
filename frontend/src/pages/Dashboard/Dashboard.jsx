import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useAuth } from 'hooks/useAuth';
import { getLessons } from 'apis/LessonApi';
import CourseDetails from 'components/dashboard/CourseDetails';
import LessonCards from 'components/dashboard/LessonCards';

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
  },
  {
    image: 'https://source.unsplash.com/random/featured/?working,office'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?working'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?office'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?working,office'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?working'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?office'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?working,office'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?working'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?office'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?working,office'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?working'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?office'
  },
  {
    image: 'https://source.unsplash.com/random/featured/?working,office'
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLessonsfromApi();
  }, []);

  const getLessonsfromApi = async () => {
    try {
      const response = await getLessons();
      setLessons(response);
      setLoading(false);
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
          {user?.username === 'teacher' && (
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
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            lessons.map((lesson, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <LessonCards
                  title={lesson.title}
                  description={lesson.subtitle}
                  image={lessonsHardCode[index]?.image? lessonsHardCode[index].image : 'https://source.unsplash.com/random/featured/?working,office'}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;

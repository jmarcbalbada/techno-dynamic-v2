import React from 'react';
import { useAuth } from 'hooks/useAuth';
import CourseDetails from 'components/dashboard/CourseDetails';
import LessonCards from 'components/dashboard/LessonCards';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';

// TODO: change hardcoded lessons to actual lessons
const lessons = [
  {
    title: 'Introduction',
    description: 'This is the first lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working,office'
  },
  {
    title: 'Starting a New Venture',
    description: 'This is the second lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working'
  },
  {
    title: 'Team Formation',
    description: 'This is the third lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?office'
  },
  {
    title: 'Market Segmentation',
    description: 'This is the fourth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working,office'
  },
  {
    title: 'TBU: Problem Discovery',
    description: 'This is the fifth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working'
  },
  {
    title: 'TBU: Primary Market Research',
    description: 'This is the sixth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?office'
  },
  {
    title: 'TBU: Beachhead Market',
    description: 'This is the seventh lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working,office'
  },
  {
    title: 'TBU: Product Specification and Full Life Cycle Use Case',
    description: 'This is the eighth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working'
  },
  {
    title: 'TBU: Value Proposition and Competitive Advantage',
    description: 'This is the ninth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?office'
  },
  {
    title: 'WildChase!',
    description: 'This is the tenth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working,office'
  },
  {
    title: 'TBU: Business Model Canvas (BMC)',
    description: 'This is the eleventh lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working'
  },
  {
    title: 'TBU: Making Customers',
    description: 'This is the twelfth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?office'
  },
  {
    title: 'TBU: Feasibility Check',
    description: 'This is the thirteenth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working,office'
  },
  {
    title: 'TBU: Money Matters',
    description: 'This is the fourteenth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working'
  },
  {
    title: 'TBU: Business Model Canvas (BMC) Recap',
    description: 'This is the fifteenth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?office'
  },
  {
    title: 'WildRoar!',
    description: 'This is the sixteenth lesson in the course.',
    image: 'https://source.unsplash.com/random/featured/?working,office'
  }
];

const Dashboard = () => {
  const { user } = useAuth();
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
          {lessons.map((lesson, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <LessonCards
                title={lesson.title}
                description={lesson.description}
                image={lesson.image}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;

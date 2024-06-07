import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import LessonList from '../../components/faq/LessonList';

const FrequentlyAskedQuestions = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Frequently Asked Questions
            </Typography>
            <Box mb={2}>
            </Box>
            <LessonList />
        </Container>
    );
};

export default FrequentlyAskedQuestions;

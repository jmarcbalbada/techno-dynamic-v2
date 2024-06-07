import React from 'react';
import {Container, Typography, Box, Button, Breadcrumbs} from '@mui/material';
import LessonList from '../../components/faq/LessonList';
import Link from "@mui/material/Link";

const FrequentlyAskedQuestions = () => {
    return (
        <Container>
            <Box sx={{ marginTop: '1rem',padding: '1rem', display: 'flex', justifyContent: 'start', alignContent: 'center' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" href="/faq">
                        Frequently Asked
                    </Link>
                    <Link underline="hover" color="inherit" href="/queries">
                        Student Queries
                    </Link>
                </Breadcrumbs>
            </Box>
            <Box mb={2}>
            </Box>
            <LessonList />
        </Container>
    );
};

export default FrequentlyAskedQuestions;

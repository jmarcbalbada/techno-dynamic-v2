import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import FaqService from '../../apis/FaqService';

const QuestionList = ({ lessonId, relatedContentId }) => {
    const [faqs, setFaqs] = useState([]);
    const [page, setPage] = useState(1);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, [lessonId, relatedContentId, page]);

    const fetchQuestions = async () => {
        try {
            const params = { lesson_id: lessonId, related_content_id: relatedContentId, page };
            const response = await FaqService.getFilteredQuestions(params);
            console.log('Questions response:', response.data);
            if (response.data) {
                setFaqs(response.data.results);
                setNext(response.data.next);
                setPrevious(response.data.previous);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    return (
        <Box>
            {faqs.map((faq, index) => (
                <Box key={faq.id} mb={1}>
                    <Typography>{`${(page - 1) * 10 + index + 1}. ${faq.question}`}</Typography>
                </Box>
            ))}
            <Box mt={2} display="flex" justifyContent="center">
                <Button disabled={!previous} onClick={() => setPage((prev) => prev - 1)}>
                    Previous
                </Button>
                <Button disabled={!next} onClick={() => setPage((prev) => prev + 1)}>
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default QuestionList;

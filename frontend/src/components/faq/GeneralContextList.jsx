import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FaqService from '../../apis/FaqService';
import QuestionList from './QuestionList';
import Button from "@mui/material/Button";

const GeneralContextList = ({ lessonId }) => {
    const [generalContexts, setGeneralContexts] = useState([]);
    const [selectedGeneralContext, setSelectedGeneralContext] = useState(null);
    const [page, setPage] = useState(1);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);

    useEffect(() => {
        fetchGeneralContexts();
    }, [lessonId, page]);

    const fetchGeneralContexts = async () => {
        try {
            const params = { lesson_id: lessonId, page };
            const response = await FaqService.getGeneralContextGroup(params);
            console.log('General contexts response:', response.data);
            if (response.data) {
                setGeneralContexts(response.data.results);
                setNext(response.data.next);
                setPrevious(response.data.previous);
            }
        } catch (error) {
            console.error('Error fetching general contexts:', error);
        }
    };

    return (
        <Box>
            {generalContexts.map((context) => (
                <Accordion key={context.related_content__related_content_id} onChange={() => setSelectedGeneralContext(context.related_content__related_content_id)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{`${context.related_content__general_context} (${context.count})`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {selectedGeneralContext === context.related_content__related_content_id && (
                            <QuestionList
                                lessonId={lessonId}
                                relatedContentId={context.related_content__related_content_id}
                            />
                        )}
                    </AccordionDetails>
                </Accordion>
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

export default GeneralContextList;

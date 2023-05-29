import { Container, Paper, TextField, Button } from '@mui/material';
import { React, useEffect, useState, useRef } from 'react';
import './EditorPage.css';
import { ContentSlide } from './ContentSlide';

export const EditorPage = () => {

    const [slides, setSlides] = useState([]);
    const [slideCount, setSlideCount] = useState(1);
    const ref = useRef(null);

    const handleAddNewSlide = () => {
        setSlideCount(prev => prev + 1);
        setSlides(prev => [...prev, <ContentSlide />]);
        ref.current?.scrollIntoView({behavior: 'smooth'});
    }

    return (
        <Container
            maxWidth="md"
            sx={{
                paddingTop: '2rem',
            }}>
            <Paper elevation={16} sx={{
                padding: '2rem',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                }}>
                <div className="lesson-editor-label">LESSON EDITOR</div>

                <div className="lesson-editor-title">
                    <span>Title:</span>
                </div>

                <TextField
                    size="small"
                    placeholder="Enter Title Here"
                    sx={{
                        width: '70%',
                    }}>                
                </TextField>

                <div className="lesson-editor-content">
                    <span>Content:</span>
                </div>

                <TextField
                    size="large"
                    placeholder="Write Something..."
                    multiline
                    rows={12}
                    sx={{
                        width: '70%',
                    }}>
                </TextField>               

                <div className="lesson-editor-buttons">
                    <Button variant="contained">Add Url</Button>
                    <Button variant="contained">Add Files</Button>
                </div>

                <div className="lesson-editor-page-number">Slide 1</div>
            </Paper>

            {slides?.map((slide, index) => {
                return (
                    <ContentSlide ref={ref} key={index} slideNum={index+2}/>
                )
            })}

            <div className='editor-bottom-controls'>
                <Button id='addButtonClicker' onClick={handleAddNewSlide}>
                    ADD NEW SLIDE
                </Button>
                <Button variant="contained" id='saveButton'>
                    SAVE
                </Button>
            </div>

        </Container>
    );
};

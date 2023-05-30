import React from 'react'
import { Box, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import './CreateLessonCard.css'

export const CreateLessonCard = () => {

    const navigate = useNavigate();

    const handleToEditorPage = () => {
        navigate(`/editor`)
    }

  return (
    <Box width='100%'>
        <Card sx={{
            backgroundColor: '#F5F5F5',
        }}>
            <div className='create-lesson-button'>
                <Button onClick={handleToEditorPage} startIcon={<AddCircleOutlineIcon />} sx={{
                    color: '#3F3F3F',
                    width: '100%',
                    padding: '1rem',
                }}>
                    Create
                </Button>
            </div>
        </Card>
    </Box>
  )
}

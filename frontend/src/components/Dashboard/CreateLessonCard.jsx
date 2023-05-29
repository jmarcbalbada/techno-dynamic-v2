import React from 'react'
import { Box, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './CreateLessonCard.css'

export const CreateLessonCard = () => {
  return (
    <Box width='100%'>
        <Card sx={{
            backgroundColor: '#F5F5F5',
        }}>
            <div className='create-lesson-button'>
                <Button startIcon={<AddCircleOutlineIcon />} sx={{
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

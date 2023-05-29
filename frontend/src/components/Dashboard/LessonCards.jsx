import React from 'react'
import { Box, Card, CardContent, CardMedia, CardActions, Button, CardActionArea } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { getLesson } from '../../apis/Lessons';
import { Link, useNavigate } from 'react-router-dom'
import './LessonCards.css'

export const LessonCards = ( { lesson, idx } ) => {
    const navigate = useNavigate();


    const handleOpenLesson = () => {
        getLesson(lesson.id).then((res) => {
            console.log('res', res)
            navigate(`/lessons/${lesson.id}`)
        })
    }


  return (
    <Box width='100%'>
        <Card sx={{
            backgroundColor: '#F5F5F5',
        }}>
            <CardActionArea onClick={handleOpenLesson}>
                <CardMedia
                    component='img'
                    height='140'
                    image='https://source.unsplash.com/random/featured/?education'
                />
                    <CardContent>
                        <h5 className='lesson-card-title'>
                            Lesson {idx + 1}
                        </h5>
                        <p className='lesson-card-description'>
                            {lesson.subtitle}
                        </p>

                        <hr className='lesson-card-hr' />

                        <p className='lesson-card-preview'>
                            {lesson.contents.length} Contents
                        </p>
                    </CardContent>
            </CardActionArea>
            <CardActions>
                <Button variant='text' endIcon={<EditIcon />} sx={{color: '#3F3F3F'}}>
                    Edit
                </Button>
            </CardActions>
            
        </Card>
    </Box>
  )
}

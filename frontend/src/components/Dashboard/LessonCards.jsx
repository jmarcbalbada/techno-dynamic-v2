import React from 'react'
import { Box, Card, CardContent, CardMedia, CardActions, Button, CardActionArea } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import './LessonCards.css'

export const LessonCards = () => {
  return (
    <Box width='100%'>
        <Card>
            <CardActionArea>
                <CardMedia
                    component='img'
                    height='140'
                    image='https://source.unsplash.com/random/featured/?nature'
                />
                <CardContent>
                    <h5 className='lesson-card-title'>
                        Title
                    </h5>
                    <p className='lesson-card-description'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget
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

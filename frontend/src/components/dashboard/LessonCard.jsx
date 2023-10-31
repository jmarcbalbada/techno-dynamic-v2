import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from 'hooks/useAuth';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';

const LessonCard = (props) => {
  const { user } = useAuth();
  const { id, lessonNumber, title, description, pageCount, image } = props;
  const navigate = useNavigate();

  const handleLessonClick = () => {
    navigate(`/lessons/${lessonNumber}/1`);
  };

  const handleEditClick = () => {
    navigate(`/lessons/${lessonNumber}/edit`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        '&:hover': {
          // add scale effect on hover
          transform: 'scale(1.03)',
          transition: 'transform 0.2s'
        }
      }}>
      <CardActionArea
        onClick={handleLessonClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}>
        <CardMedia
          component='img'
          height='140'
          image={
            image
              ? image.includes('null')
                ? 'https://source.unsplash.com/random/featured/?working,office'
                : `http://127.0.0.1:8000${image}`
              : 'https://source.unsplash.com/random/featured/?working,office'
          }
        />
        <CardContent>
          {/* TODO: change to actual details needed for the card */}
          <Typography gutterBottom variant='h5' component='div'>
            {title}
          </Typography>
          <Typography gutterBottom variant='body1' color='text.secondary'>
            {description}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {pageCount} {pageCount === 1 ? 'page' : 'pages'}
          </Typography>
        </CardContent>
      </CardActionArea>
      {user?.role === 'teacher' && (
        <CardActions>
          <Button onClick={handleEditClick} startIcon={<EditIcon />} fullWidth>
            Edit
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default LessonCard;

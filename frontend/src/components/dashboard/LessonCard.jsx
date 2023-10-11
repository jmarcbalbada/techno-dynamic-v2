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
  const { id, title, description, image } = props;
  const navigate = useNavigate();

  const handleLessonClick = () => {
    navigate(`/lessons/${id}/1`);
  };

  const handleEditClick = () => {
    navigate(`/lessons/${id}/edit`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
      {/* TODO: add onClick handler to navigate to lesson page */}
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
          // TODO: change hardcoded image to actual image
          image={image}
        />
        <CardContent>
          {/* TODO: change to actual details needed for the card */}
          <Typography gutterBottom variant='h5' component='div'>
            {title}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* TODO: change hardcoded teacher string to user.role */}
      {user?.role === 'teacher' && (
        // TODO: add onClick handler to navigate to edit lesson page
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

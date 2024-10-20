import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from 'hooks/useAuth';
import config from 'data/config';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';

const LessonCard = (props) => {
  const { user } = useAuth();
  const { id, lessonNumber, title, description, pageCount, image, fileCount } =
    props;
  const url = config.API_URL.endsWith('/')
    ? config.API_URL.slice(0, -1)
    : config.API_URL;
  const imageUrl = `${url}`;
  const navigate = useNavigate();

  // Randomly choose between 0.jpg or 1.jpg
  const randomImageSuffix = Math.random() < 0.5 ? '1.jpg' : '2.jpg';

  const handleLessonClick = () => {
    navigate(`/lessons/${lessonNumber}/1/false/${id}`);
  };

  // deprecated
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
        transition: 'transform 0.15s ease-in-out',
        '&:hover': { transform: 'scale3d(1.02, 1.02, 1)' }
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
                ? `/office/office${randomImageSuffix}`
                : `${imageUrl}${image}`
              : `/office/office${randomImageSuffix}`
          }
        />
        <CardContent
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
          <Typography gutterBottom variant='h5' component='div'>
            {title}
          </Typography>
          <Typography
            gutterBottom
            variant='body1'
            color='text.secondary'
            sx={{
              flexGrow: '1'
            }}>
            {description}
          </Typography>
          <Divider
            sx={{
              mb: '0.5rem'
            }}
          />
          <Typography gutterBottom variant='caption' color='text.secondary'>
            {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            {' · '}
            {fileCount} {fileCount === 1 ? 'file' : 'files'}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/* {user?.role === 'teacher' && (
        <CardActions>
          <Button onClick={handleEditClick} startIcon={<EditIcon />} fullWidth>
            Edit
          </Button>
        </CardActions>
      )} */}
    </Card>
  );
};

export default LessonCard;

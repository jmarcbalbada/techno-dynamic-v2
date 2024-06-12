import React, { useState } from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Box,
  ListItemButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth.jsx';
import { LessonsService } from '../../apis/LessonsService';

const NotificationItem = ({
  notif,
  deleteNotificationById,
  setOpenedNotificationById
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { setNotificationId } = useAuth();

  const handleNotificationLessonClick = (lessonNumber, lessonID) => {
    console.log('lessonID notif', lessonID);
    console.log('lessonNumber notif', lessonNumber);
    console.log('Clicked here');
    navigate(`/lessons/${lessonNumber}/1/true/${lessonID}`);
    // window.location.reload();
  };

  const handleClick = async () => {
    setNotificationId(notif.notif_id);
    localStorage.setItem('notification_id', notif.notif_id);
    const id = localStorage.getItem('notification_id');
    id ? console.log('id was created') : console.log('id was not created');
    try {
      const response = await LessonsService.getById(notif.lesson);
      const lessonNum = response.data;
      // console.log("lesson num", lessonNum);
      handleNotificationLessonClick(lessonNum.lessonNumber, lessonNum.id);
    } catch (error) {
      console.log(error);
    }

    console.log('notif', notif);
    // navigate(`/suggestcontent`);
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deleteNotificationById(notif.notif_id);
    handleMenuClose();
  };

  const handleMarkAsUnread = () => {
    setOpenedNotificationById(notif.notif_id);
    console.log('notif_id', notif.notif_id);
    handleMenuClose();
  };

  return (
    <ListItemButton
      // button
      onClick={handleClick}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: notif.is_open ? '#f0f0f0' : '#ffffff'
        // cursor: 'pointer'
      }}>
      <ListItemText
        primary={`Lesson ${notif.lesson}`}
        secondary={notif.message}
      />
      <Box>
        <IconButton edge='end' aria-label='options' onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}>
          <MenuItem onClick={handleMarkAsUnread}>Mark as unread</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>
    </ListItemButton>
  );
};

export default NotificationItem;

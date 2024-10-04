import React, { useState } from 'react';
import {
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
  setOpenedNotificationById,
  onClose // Make sure to use the onClick prop to close the notification panel
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { setNotificationId } = useAuth();

  const handleNotificationLessonClick = async () => {
    setNotificationId(notif.notif_id);
    localStorage.setItem('notification_id', notif.notif_id);
    const id = localStorage.getItem('notification_id');

    try {
      const response = await LessonsService.getById(notif.lesson);
      const lessonNum = response.data;
      await navigate(
        `/lessons/${lessonNum.lessonNumber}/1/true/${lessonNum.id}`
      );

      // Close the notification panel
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuClick = (event) => {
    event.stopPropagation(); // Stop event propagation to prevent the menu click from affecting the parent
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
    handleMenuClose();
  };

  const formattedDate =
    new Date(notif.date_created).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) +
    ' at ' +
    new Date(notif.date_created).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

  return (
    <ListItemButton
      onClick={handleNotificationLessonClick} // Use the onClick from NotificationIcon to close the panel
      // handleNotificationLessonClick
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: notif.is_open ? '#f0f0f0' : '#ffffff'
      }}>
      <ListItemText
        primary='Review required'
        secondary={
          <>
            <span>{notif.message}</span>
            <br />
            <span>{formattedDate}</span>
          </>
        }
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

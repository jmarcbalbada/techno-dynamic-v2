import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Box,
  List,
  Paper,
  ClickAwayListener,
  Typography
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import NotificationItem from './NotificationItem'; // Import the custom component
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const NotificationIcon = ({
  countNotif,
  unreadNotif,
  handleNotificationClick,
  setOpenedNotificationById,
  deleteNotificationById,
  setAllToReadNotifications
}) => {
  const [showNotification, setShowNotification] = useState(false);

  const handleClickAway = () => {
    setShowNotification(false);
  };

  const handleIconButtonClick = () => {
    setShowNotification((prev) => !prev);
    handleNotificationClick();
  };

  const handleItemClick = (notifId) => {
    setOpenedNotificationById(notifId); // Mark notification as opened
    setShowNotification(false); // Close the notification panel after marking as opened
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton
        sx={{
          paddingRight: {
            xs: '1rem', // small devices
            sm: '1.25rem', // small-medium devices
            md: '1.5rem', // medium devices
            lg: '1.75rem', // large devices
            xl: '2rem' // extra large devices
          },
          display: 'inline',
          transition: 'transform 0.3s ease',
          '&:hover': {
            backgroundColor: 'transparent',
            transform: 'scale(1.2)'
          }
        }}
        onClick={handleIconButtonClick}>
        <Badge badgeContent={countNotif} color='error'>
          <NotificationsOutlinedIcon sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>
      {showNotification && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            sx={{
              position: 'absolute',
              top: '40px',
              right: '0',
              width: '300px',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 1
            }}>
            <div>
              {unreadNotif.length <= 0 ? (
                <Typography
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 3,
                    '&:hover': {
                      cursor: 'default' // Set the hover cursor to normal
                    }
                  }}>
                  <ThumbUpIcon
                    sx={{
                      color: '#1b5e20'
                    }}
                  />
                  No notifications as of now.
                </Typography>
              ) : (
                <List>
                  {unreadNotif.map((notif) => (
                    <NotificationItem
                      key={notif.notif_id}
                      notif={notif}
                      onClick={() => handleItemClick(notif.notif_id)} // Close panel on item click
                      setOpenedNotificationById={setOpenedNotificationById}
                      deleteNotificationById={deleteNotificationById}
                    />
                  ))}
                </List>
              )}
            </div>
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
};

export default NotificationIcon;

import React, { useEffect, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { AppBar as MuiAppBar, Box, Toolbar, useTheme } from '@mui/material';
import useUser from '../hooks/useUser';
import useNotifications from '../hooks/useNotifications';
import UserMenu from '../components/appbar/UserMenu.jsx';
import Logo from '../components/appbar/Logo';
import NotificationIcon from '../components/appbar/NotificationIcon';
import { TeacherService } from 'apis/TeacherService.js';

const Appbar = () => {
  const { user } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme();
  const [suggestions, setSuggestions] = useState();

  const { opt_in } = useUser(user);
  const {
    unreadNotif,
    countNotif,
    setAllToReadNotifications,
    deleteNotificationById,
    setOpenedNotificationById
  } = useNotifications(user);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await TeacherService.getTeacherSuggestion();
        setSuggestions(response.data.teacher_allow_suggestion);
        // console.log('suggestion', suggestions);
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      }
    };
    fetchSuggestions();
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <MuiAppBar
      variant='outlined'
      elevation={0}
      position='static'
      sx={{
        background: theme.palette.white.main,
        borderBottom: '1px dashed #e0e0e0',
        position: 'relative'
      }}>
      <Toolbar>
        <Logo />
        {user.role === 'teacher' && suggestions && (
          <NotificationIcon
            countNotif={countNotif}
            unreadNotif={unreadNotif}
            handleNotificationClick={setAllToReadNotifications}
            deleteNotificationById={deleteNotificationById}
            setOpenedNotificationById={setOpenedNotificationById}
            onClick={setAllToReadNotifications}
          />
        )}
        <Box flexGrow={0}>
          <UserMenu
            anchorElUser={anchorElUser}
            handleOpenUserMenu={handleOpenUserMenu}
            handleCloseUserMenu={handleCloseUserMenu}
          />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default Appbar;

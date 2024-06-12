import React, { useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { AppBar as MuiAppBar, Box, Toolbar, useTheme } from '@mui/material';
import useUser from '../hooks/useUser';
import useNotifications from '../hooks/useNotifications';
import UserMenu from '../components/appbar/UserMenu.jsx';
import Logo from '../components/appbar/Logo';
import NotificationIcon from '../components/appbar/NotificationIcon';

const Appbar = () => {
  const { user } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme();

  const { opt_in } = useUser(user);
  const {
    unreadNotif,
    countNotif,
    setAllToReadNotifications,
    deleteNotificationById,
    setOpenedNotificationById
  } = useNotifications(user);

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
        {user.role === 'teacher' && opt_in && (
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

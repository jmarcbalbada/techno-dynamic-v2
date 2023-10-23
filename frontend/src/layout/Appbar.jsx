import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from 'hooks/useAuth';
import { useTheme } from '@mui/material';
import lionLogo from 'assets/lionlogo.png';

import { AppBar as MuiAppBar } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const Appbar = () => {
  const { user, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleNavigateToDashboard = () => {
    navigate('/');
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  return (
    // TODO: change color to palette color
    <MuiAppBar
      variant='outlined'
      position='static'
      sx={{
        background: theme.palette.white.main,
        borderBottom: '1px dashed #e0e0e0'
      }}>
      <Toolbar>
        <Box display='flex' alignItems='center' flexGrow={1}>
          <Box
            onClick={handleNavigateToDashboard}
            display='flex'
            alignItems='center'
            sx={{
              cursor: 'pointer'
            }}>
            <img src={lionLogo} alt='lion logo' width='40' height='40' />
            <Typography
              display={{ xs: 'none', sm: 'flex' }}
              variant='h6'
              component='div'
              sx={{
                ml: 2,
                color: theme.palette.getContrastText(theme.palette.white.main)
              }}>
              Technopreneurship
            </Typography>
          </Box>
        </Box>
        <Box flexGrow={0}>
          <Tooltip title='Open Settings'>
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0
              }}>
              <Avatar>
                {user?.first_name?.charAt(0).toUpperCase()}
                {user?.last_name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{
              mt: 4.5
            }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}>
            {/* TODO: Add Profile Navigation Handling  */}
            <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default Appbar;

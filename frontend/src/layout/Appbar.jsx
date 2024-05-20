import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import lionLogo from "assets/lionlogo.png";
import { AppBar as MuiAppBar } from "@mui/material";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Button, ListItemIcon, useTheme } from "@mui/material";
import Menu from "@mui/material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import NotificationMessageLayout from "../pages/Notification/NotificationMessageLayout";
import { NotificationService } from "../apis/NotificationService";
import { UsersService } from "../apis/UsersService";

const Appbar = () => {
  const { user, logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [unreadNotif, setUnreadNotif] = useState([]);
  const [countNotif, setCountNotif] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const [u_user, setU_user] = useState([]);
  const opt_in = user.opt_in

  const open = Boolean(anchorElUser);

  // useEffect(() => {
  //   if (user.role === "teacher") {
  //     getUnreadNotifications();
  //     getCountUnreadNotifications();
  //   }
  // }, [countNotif, unreadNotif]);

  useEffect(() => {
    if (user.role === "teacher") {
      getCountUnreadNotifications();
    }
    // console.log("userid", user.id)
  }, []);

  useEffect(() => {
    getUserViaId();
    // console.log("u_user",u_user)
  }, []);

  const getUserViaId = async () => {
    try {
      const response = await UsersService.getUserbyID(user.id);
      setU_user(response.data);
      console.log("u_user",u_user)
      // console.log("response.data = ", response.data);
      // console.log("unreadNotif = ", unreadNotif);
    } catch (error) {
      // console.log("error", error);
    } finally {
      // close
    }
  };

  useEffect(() => {
    if (user.role === "teacher") {
      // Call getUnreadNotifications only when countNotif changes
      // if (countNotif > 0) {
      //   getUnreadNotifications();
      // }
      getUnreadNotifications();
    }
  }, [countNotif]);

  

  const getUnreadNotifications = async () => {
    try {
      const response = await NotificationService.getUnreadNotif();
      setUnreadNotif(response.data);
      // console.log("response.data = ", response.data);
      // console.log("unreadNotif = ", unreadNotif);
    } catch (error) {
      // console.log("error", error);
    } finally {
      // close
    }
  };

  const setAllToReadNotifications = async () => {
    try {
      const response = await NotificationService.markAllAsRead();
      setCountNotif(0);
    } catch (error) {
      // console.log("error", error);
    } finally {
      // close
    }
  };

  const getCountUnreadNotifications = async () => {
    try {
      const response = await NotificationService.getCountUnreadNotif();
      setCountNotif(response.data.unread_count);
      // console.log("Rresponse", response.data.unread_count)
      // console.log("response.data = ", response.data);
      // console.log("unreadNotif = ", unreadNotif);
    } catch (error) {
      // console.log("error", error);
    } finally {
      // close
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const notifIsFinallyClose = (isClosed) => {
    setShowNotification(!isClosed);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const handleNotificationClick = () => {
    setAllToReadNotifications();
    setShowNotification(!showNotification);
  };

  const handleNavigateToDashboard = () => {
    navigate("/");
  };

  return (
    <MuiAppBar
      variant="outlined"
      elevation={0}
      position="static"
      sx={{
        background: theme.palette.white.main,
        borderBottom: "1px dashed #e0e0e0",
        position: "relative", // Ensure relative positioning
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Box
            onClick={handleNavigateToDashboard}
            display="flex"
            alignItems="center"
            sx={{
              cursor: "pointer",
            }}
          >
            <img src={lionLogo} alt="lion logo" width="40" height="40" />
            <Typography
              display={{ xs: "none", sm: "flex" }}
              variant="h6"
              component="div"
              sx={{
                ml: 2,
                color: theme.palette.getContrastText(theme.palette.white.main),
              }}
            >
              Technopreneurship
            </Typography>
          </Box>
        </Box>
        {user.role === "teacher" && (
          <div style={{ position: "relative" }}>
            <IconButton
              sx={{
                paddingRight: "60px",
                display: "inline",
                transition: "transform 0.3s ease",
                "&:hover": {
                  backgroundColor: "transparent",
                  transform: "scale(1.1)",
                },
              }}
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={countNotif} color="error">
                <NotificationsOutlinedIcon sx={{ fontSize: 28 }} />
              </Badge>
            </IconButton>
            {(showNotification) && (
              <NotificationMessageLayout
                onClick={handleNotificationClick} // Pass the onclick event
                closedFinally={notifIsFinallyClose}
                unreadNotif={unreadNotif}
              />
            )}
          </div>
        )}
        <Box flexGrow={0}>
          <Tooltip title="Open Settings">
            <Button
              onClick={handleOpenUserMenu}
              size="large"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Typography sx={{ mr: 1 }}>{user?.first_name}</Typography>
              <Avatar>{user?.first_name?.charAt(0).toUpperCase()}</Avatar>
            </Button>
          </Tooltip>
          <Menu
            sx={{
              mt: 4.5,
            }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default Appbar;

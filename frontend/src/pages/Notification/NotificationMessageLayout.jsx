import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from 'react-router-dom';
import "./NotificationMessageLayout.css";

const NotificationMessageLayout = ({ closedFinally }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const lessonNumber = 1; // temporary

  const handleNotificationLessonClick = () => {
    console.log("Clicked here");
    closedFinally(true);
    navigate(`/lessons/${lessonNumber}/1/true`);
  }

  return (
    <div className="notification-popup">
      <Box
        sx={{
          backgroundColor: theme.palette.background.darker,
          width: "450px",
          height: "200px",
          borderRadius: theme.spacing(3),
          border: `3px solid ${theme.palette.primary.main}`,
          overflowY: "auto",
        }}
      >
        <Typography
          sx={{
            paddingTop: "10px",
            paddingLeft: "15px",
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "8px",
            color: theme.palette.textfield.main
          }}
        >
          Notification
        </Typography>
        <Box
          sx={{
            backgroundColor: theme.palette.white.main,
            height: "40%",
            marginTop: "5px",
            width: "93%",
            borderRadius: theme.spacing(1),
            display: "flex",
            position: "relative",
            marginLeft: "15px",
            cursor: "pointer",
          }}
          onClick={handleNotificationLessonClick}
        >
          <BuildCircleIcon
            sx={{
              color: theme.palette.background.neutral,
              fontSize: "45px",
              marginTop: "3%",
              marginLeft: "1%",
            }}
          />
          <Typography
            sx={{
              marginTop: "3%",
              marginLeft: "2%",
              //   width: "calc(80% - 30px)",
              width: "80%",
              height: "60%",
              fontSize: "14px",
              color: theme.palette.textfield.main,
              // backgroundColor: "gray",
            }}
          >
            Your <b>Introduction</b> lesson has an AI content suggestion based
            on FAQ’s from students!
          </Typography>
          <MoreHorizIcon
            sx={{
              marginTop: "7%",
              fontSize: "17px",
              cursor: "pointer",
              color: theme.palette.textfield.main,
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              bottom: "3px",
              right: "12px",
              fontSize: "9px",
              fontWeight: "600",
              color: theme.palette.primary.main,
              // backgroundColor: "gray",
            }}
          >
            March 10, 2024 at 5:30 PM
          </Typography>
        </Box>
        
      </Box>
    </div>
  );
};

export default NotificationMessageLayout;

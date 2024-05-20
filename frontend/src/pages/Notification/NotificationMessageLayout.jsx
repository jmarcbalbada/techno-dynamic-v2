import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";
import "./NotificationMessageLayout.css";
import { LessonsService } from "../../apis/LessonsService";
import { format } from "date-fns"; // Import date-fns for date formatting

const NotificationMessageLayout = ({ closedFinally, unreadNotif }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNotificationLessonClick = (lessonNumber, lessonID) => {
    // console.log("lessonID notif", lessonID);
    // console.log("Clicked here");
    closedFinally(true);
    navigate(`/lessons/${lessonNumber}/1/true/${lessonID}`);
    window.location.reload();
  };

  const fetchLessonNumber = async (lessonId, event) => {
    try {
      const response = await LessonsService.getById(lessonId);
      const lessonNum = response.data;
      // console.log("lesson num", lessonNum);
      handleNotificationLessonClick(lessonNum.lessonNumber, lessonNum.id);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("unread", unreadNotif);

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
            color: theme.palette.textfield.main,
          }}
        >
          Notification
        </Typography>
        {unreadNotif.length === 0 ? (
          <Typography
            sx={{
              paddingTop: "10px",
              paddingLeft: "15px",
              fontSize: "16px",
              fontWeight: "500",
              color: theme.palette.textfield.main,
            }}
          >
            No notifications for now.
          </Typography>
        ) : (
          unreadNotif.map((notif) => (
            <Box
              key={notif.notif_id}
              sx={{
                backgroundColor: theme.palette.white.main,
                height: "50%",
                marginTop: "5px",
                width: "93%",
                borderRadius: theme.spacing(1),
                display: "flex",
                position: "relative",
                marginLeft: "15px",
                cursor: "pointer",
              }}
              onClick={() => fetchLessonNumber(notif.lesson)}
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
                  width: "80%",
                  height: "60%",
                  fontSize: "14px",
                  color: theme.palette.textfield.main,
                }}
              >
                {notif.message}
              </Typography>
              <Typography
                sx={{
                  position: "absolute",
                  bottom: "3px",
                  right: "12px",
                  fontSize: "9px",
                  fontWeight: "600",
                  color: theme.palette.primary.main,
                }}
              >
                {format(new Date(notif.date_created), "MMMM d, yyyy 'at' h:mm a")}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </div>
  );
};

export default NotificationMessageLayout;

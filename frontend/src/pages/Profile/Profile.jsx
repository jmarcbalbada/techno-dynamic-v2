import React, { useEffect, useState } from "react";

import { useAuth } from "hooks/useAuth";

import {
  Box,
  Paper,
  Container,
  Typography,
  TextField,
  styled,
  Divider,
  Chip,
  Switch,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import { UsersService } from "../../apis/UsersService";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Tooltip from "@mui/material/Tooltip";

const Profile = () => {
  const { user } = useAuth();
  // console.log("user", user);
  const [opt_in_state, setOpt_in_state] = useState(user.opt_in);

  useEffect(() => {
    getUserViaId();
  }, []);

  const handleSwitchChange = () => {
    setOpt_in_state(!opt_in_state);
    setAiRecommendation();
    window.location.reload();
  };

  const setAiRecommendation = async () => {
    try {
      const response = await UsersService.setOptIn(user.id);
      // console.log("response_data AI = ", response.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      // close
    }
  };

  const getUserViaId = async () => {
    try {
      // console.log("was here");
      const response = await UsersService.getUserbyID(user.id);
      // console.log("response_data", response.data.opt_in);
      setOpt_in_state(response.data.opt_in);
    } catch (error) {
      console.log("error", error);
    } finally {
      // close
    }
  };

  const renderUserType = () => {
    if (user?.role === "student") {
      return (
        <>
          <Divider
            textAlign="left"
            sx={{
              my: 2,
              "&::before": {
                display: "none",
                padding: 0,
              },
              ".MuiDivider-wrapper": {
                paddingLeft: 0,
              },
            }}
          >
            <Chip label="Student Information" variant="outlined" />
          </Divider>
          <Box display="flex" flexDirection="column">
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
              }}
            >
              Year Level
            </Typography>
            <Typography variant="h6" gutterBottom>
              {user?.student_data?.year}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
              }}
            >
              Course
            </Typography>
            <Typography variant="h6" gutterBottom>
              {user?.student_data?.course}
            </Typography>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Divider
            textAlign="left"
            sx={{
              my: 2,
              "&::before": {
                display: "none",
                padding: 0,
              },
              ".MuiDivider-wrapper": {
                paddingLeft: 0,
              },
            }}
          >
            <Chip label="Instructor Information" variant="outlined" />
          </Divider>
          <Box display="flex" gap={1}>
            <Typography variant="h5" gutterBottom>
              Instructor Account
            </Typography>
            <Tooltip title="Verified">
              <CheckIcon sx={{ color: "green", fontSize: "1.7rem" }} />
            </Tooltip>
          </Box>
          <Box display="flex" gap={1}>
            <Typography variant="h6" gutterBottom>
              Allow AI Insights and Content Suggestions
            </Typography>
            <Tooltip title="Recommended">
              <AutoAwesomeIcon sx={{ color: "#4c80d4", fontSize: "1.0rem" }} />
            </Tooltip>
            <Switch checked={opt_in_state} onChange={handleSwitchChange} />
          </Box>
        </>
      );
    }
  };

  return (
    <Container>
      <Box>
        <h1>{user?.first_name}'s Profile</h1>
        <Box width={1} display="flex" flexDirection="column" gap={1}>
          <Box>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              }}
            >
              <Divider
                textAlign="left"
                sx={{
                  mb: 2,
                  "&::before": {
                    display: "none",
                    padding: 0,
                  },
                  ".MuiDivider-wrapper": {
                    paddingLeft: 0,
                  },
                }}
              >
                <Chip label="Basic Information" variant="outlined" />
              </Divider>
              <Box display="flex" flexDirection="column">
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                  }}
                >
                  First Name
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user?.first_name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                  }}
                >
                  Last Name
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user?.last_name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: "italic",
                  }}
                >
                  Email
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user?.email}
                </Typography>
                {renderUserType()}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;

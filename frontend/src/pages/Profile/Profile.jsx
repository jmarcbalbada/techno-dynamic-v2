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

const Profile = () => {
  const { user } = useAuth();
  console.log(user);
  const [u_user, setU_user] = useState([]);
  // const [opt_in_state, setOpt_in_state] = useState(
  //   u_user.opt_in ? u_user.opt_in : user.opt_in
  // );
  const [opt_in_state, setOpt_in_state] = useState(false);
  // console.log("opt", user.opt_in)

  useEffect(() => {
    getUserViaId();
    // console.log("u_user",u_user)
  }, []);

  console.log("u_user", u_user);

  const handleSwitchChange = () => {
    setOpt_in_state(!opt_in_state);
  };

  const getUserViaId = async () => {
    try {
      const response = await UsersService.getUserbyID(user.id);
      setU_user(response.data);
      // console.log("u_user", u_user);
      console.log("before", opt_in_state);
      setOpt_in_state(u_user.opt_in);
      console.log("after", opt_in_state);
      // console.log("response.data = ", response.data);
      // console.log("unreadNotif = ", unreadNotif);
    } catch (error) {
      // console.log("error", error);
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
            <CheckIcon sx={{ color: "green", fontSize: "1.7rem" }} />
          </Box>
          <Box display="flex" gap={1}>
            <Typography variant="h5" gutterBottom>
              Allow AI Recommendation
            </Typography>
            <Switch checked={opt_in_state} onChange={handleSwitchChange} />
            {/* <CheckIcon sx={{ color: 'green', fontSize: '1.7rem' }} /> */}
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

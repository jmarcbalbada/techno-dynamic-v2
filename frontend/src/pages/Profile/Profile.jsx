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
  Input,
  Button,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import { UsersService } from "../../apis/UsersService";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Tooltip from "@mui/material/Tooltip";
import useSuggestion from "../../hooks/useSuggestion";
import useThreshold from "../../hooks/useThreshold";
import { TeacherService } from "../../apis/TeacherService";

const Profile = () => {

  const { user ,threshold,suggestion} = useAuth();
  const [opt_in_state, setOpt_in_state] = useState(user.opt_in);
  const [suggestions,setSuggestions] = useState(suggestion)
  const [thresholds,setThresholds] = useState(threshold)


  useEffect(() => {
    console.log("Suggestion profile passing winson",thresholds)
    getUserViaId();
  }, []);

  const handleSave = async () => {
    const thresholdValue = thresholds; // Convert the input value to a float
    // console.log("LKSJDFKLDSF",thresholdValue)
    if (isNaN(thresholdValue)) {
      alert('Please enter a valid number');
      return;
    }
    try {
      const floatingthreshold = parseFloat(thresholdValue);
      // console.log('Saving threshold:', typeof(testing), parseFloat(testing));
      await TeacherService.setTeacherThreshold(floatingthreshold);
      alert('Threshold updated successfully');
    } catch (error) {
      console.error('Failed to update threshold', error);
      alert('Failed to update threshold');
    }
  };

  const handleSuggestion = async (event) => {
    const similarity = event.target.checked;
    try {
      console.log("similarity",similarity);
      await TeacherService.setTeacherSuggestion(similarity);
      setSuggestions((prev) => !prev); // Correctly toggle the suggestions state
    } catch (error) {
      console.error('Failed to set suggestion', error);
    }
  };
  

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
          {/* <Box display="flex" gap={1}>
            <Typography variant="h6" gutterBottom>
              Allow AI Insights and Content Suggestions
            </Typography>
            <Tooltip title="Recommended">
              <AutoAwesomeIcon sx={{ color: "#4c80d4", fontSize: "1.0rem" }} />
            </Tooltip>
            <Switch checked={opt_in_state} onChange={handleSwitchChange} />
          </Box> */}
          <Box display="flex" gap={1}>
            <Typography variant="h6" gutterBottom>
              Allow AI Insights and Content Suggestions
            </Typography>
            <Tooltip title="Recommended">
              <AutoAwesomeIcon sx={{ color: "#4c80d4", fontSize: "1.0rem" }} />
            </Tooltip>
            <Switch checked={suggestions} onChange={handleSuggestion} />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6" gutterBottom>
              Context Similarity Threshold
            </Typography>
            <Tooltip title="Recommended">
              <AutoAwesomeIcon sx={{ color: '#4c80d4', fontSize: '1.0rem' }} />
            </Tooltip>
            <input
            step="0.01" 
            type="number"
            value={thresholds}
            onChange={(e) => {
              setThresholds(e.target.value)
              console.log(thresholds)
            }}
            placeholder="Input the value"
            />
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
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

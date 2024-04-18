import React, { useState, useEffect } from "react";
import { Typography, Box, Button } from "@mui/material";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { useTheme } from "@mui/material";
import LessonPage from "components/lessonpage/LessonPage";
import {
    useParams,
    useNavigate,
    useLocation,
    Navigate,
  } from "react-router-dom";

const InsightLayout = ( { handleSuggest }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const sampleContent = `<p><strong>Entrepreneurship's Impact:</strong> Students are keen to explore entrepreneurship's role in driving economic growth and innovation, especially in identifying opportunities and fostering competition.</p>

<p><strong>Qualities of Success:</strong> There's strong interest in the qualities defining successful entrepreneurs, emphasizing creativity, determination, and resilience.</p>

<p><strong>Technological Influence:</strong> Students recognize the importance of technology in entrepreneurship, highlighting the need to leverage advancements for innovation and competitiveness.</p>

<p><strong>Areas for Improvement:</strong> To enhance learning, deeper insights into specific strategies for opportunity identification, risk management, and technological integration could be provided.</p>

<p>Unlock the full potential of your lesson materials by addressing student curiosity and strengthening key concepts.</p>`;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          marginTop: "-17px",
          padding: "20px",
          borderRadius: "5px",
          bgcolor: "#e6b800",
          height: "fit-content",
          marginBottom: "2%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TipsAndUpdatesIcon sx={{ color: "#fff", marginRight: "10px" }} />
          <Typography
            variant="body1"
            sx={{
              color: "#fff",
              flex: 1,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            Here's how to strengthen your content ...
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Button
              variant="contained"
              sx={{
                ml: 1,
                backgroundColor: "#1b5e20",
                textTransform: "none",
                paddingRight: "10px",
              }}
              onClick={handleSuggest}
            >
              <HandshakeOutlinedIcon sx={{ marginRight: "10px" }} />
              Suggest Content
            </Button>
          </Box>
        </div>
      </Box>
      <Box
        sx={{
          position: "relative",
          height: "fit-content",
          marginBottom: "4%",
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.lighterneutral,
            borderRadius: theme.spacing(3),
            height: "fit-content",
            width: "100%",
          }}
        >
          <Box
            sx={{
              marginLeft: "2%",
              paddingTop: "1%",
              lineHeight: 1.8,
              paddingBottom: "20px",
            }}
          >
            <LessonPage pageContent={sampleContent} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default InsightLayout;

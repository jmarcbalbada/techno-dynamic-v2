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

const InsightLayout = ({ handleSuggest, sampleContentReal }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const sampleContent = String(sampleContentReal);

  //   const sampleContent = `<p><strong>Entrepreneurship's Impact:</strong> Students are keen to explore entrepreneurship's role in driving economic growth and innovation, especially in identifying opportunities and fostering competition.</p>

  // <p><strong>Qualities of Success:</strong> There's strong interest in the qualities defining successful entrepreneurs, emphasizing creativity, determination, and resilience.</p>

  // <p><strong>Technological Influence:</strong> Students recognize the importance of technology in entrepreneurship, highlighting the need to leverage advancements for innovation and competitiveness.</p>

  // <p><strong>Areas for Improvement:</strong> To enhance learning, deeper insights into specific strategies for opportunity identification, risk management, and technological integration could be provided.</p>

  // <p>Unlock the full potential of your lesson materials by addressing student curiosity and strengthening key concepts.</p>`;

  // const sampleContent = `1. <strong>Market Segmentation Overview:</strong> Students inquire about the definition and importance of market segmentation, types of segmentation, criteria for demographic segmentation, and how businesses can target their audience effectively using segmentation.<br>\n- <strong>Psychographic vs. Behavioral Segmentation:</strong> Students seek clarification on the differences between psychographic and behavioral segmentation.<br>\n- <strong>Impact on Customer Satisfaction and Loyalty:</strong> Students are interested in understanding how market segmentation influences customer satisfaction and loyalty.<br>\n- <strong>Data Analytics in Market Segmentation:</strong> Students want to know how data analytics can be utilized to enhance market segmentation efforts.<br>\n- <strong>Geographic Segmentation:</strong> Students inquire about geographic segmentation and its practical application in business strategies.<br>\n- <strong>Enhancing Audience Targeting:</strong> Students are curious about how market segmentation helps businesses target their audience more effectively.<br>\n- <strong>Summary of Market Segmentation:</strong> Students seek a concise summary of the topic for better understanding.<br>`;
  const modifiedContent = sampleContent.replace('1. ', '');

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
            <LessonPage pageContent={modifiedContent} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default InsightLayout;

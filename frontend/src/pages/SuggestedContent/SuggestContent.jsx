import React, { useEffect, useState } from "react";
import { LessonsService } from "apis/LessonsService";
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import Container from "@mui/material/Container";
import LessonPage from "components/lessonpage/LessonPage";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useTheme } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const SuggestContent = () => {
  const { lessonNumber, pageNumber } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [allContents, setAllContents] = useState("");
  const theme = useTheme();

  const tempSuggestedContent = `<div data-youtube-video="">
  <iframe width="640" height="360" src="https://www.youtube.com/embed/wFxIzCtw8QU" frameborder="0" allowfullscreen></iframe>
</div><p></p>
<h2>Introduction:</h2>
<p>Welcome to today's lesson on market segmentation in technopreneurship. Market segmentation is a powerful tool for technopreneurs to identify and target specific customer groups. In this lesson, we'll explore its importance and application in driving business growth.</p>
<h2>Key Concepts:</h2>
<ol>
  <li>
    <h3>What is Market Segmentation?</h3>
    <p>Market segmentation divides a market into distinct groups with different needs, preferences, or characteristics. Types include demographic, geographic, psychographic, and behavioral segmentation.</p>
  </li>
  <li>
    <h3>Importance of Market Segmentation:</h3>
    <p>It allows customization of products/services, efficient resource allocation, competitive advantage, and identifies new market opportunities.</p>
  </li>
  <li>
    <h3>Process of Market Segmentation:</h3>
    <p>Research, segmentation, targeting, and positioning are key steps in market segmentation.</p>
  </li>
  <li>
    <h3>Examples of Market Segmentation:</h3>
    <p>E-commerce platforms, SaaS companies, and social media platforms utilize market segmentation for personalized experiences and targeted advertising.</p>
  </li>
  <li>
    <h3>Challenges and Considerations:</h3>
    <p>Data privacy, market dynamics, and over-segmentation are challenges to consider when implementing market segmentation strategies.</p>
  </li>
</ol>
<h2>Conclusion:</h2>
<p>Market segmentation empowers technopreneurs to understand customers deeply and cater to their needs effectively, driving innovation and sustainable business growth in today's dynamic marketplace.</p>`;

  useEffect(() => {
    getLessonLessonNumber(lessonNumber);
  }, []);

  const getLessonLessonNumber = async (lessonNumber) => {
    try {
      const response = await LessonsService.getByLessonNumber(lessonNumber);
      setLesson(response.data);
      setTotalPage(response.data.pages.length);

      // Concatenate contents of all pages
      let contents = "";
      response.data.pages.forEach((page) => {
        contents += page.contents;
      });
      setAllContents(contents);

      //   console.log("totalPage", totalPage);
      //   console.log("allContents", contents);
      //   console.log("response.data", lesson);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" sx={{ mt: 2, mb: 12 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          marginTop: "-17px",
          padding: "20px",
          borderRadius: "5px",
          bgcolor: theme.palette.primary.main,
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
          <VerifiedIcon sx={{ color: "#fff", marginRight: "10px" }} />
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
            Suggested content for you!
          </Typography>
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "4px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: theme.palette.background.danger,
            "&:hover": {
              backgroundColor: "#761e1e",
            },
            textTransform: "none", // Set text to normal case
            paddingRight: "10px", // Add padding to the right of the icon
            borderRadius: "20px",
          }}
          // onClick={handleInsight}
        >
          <CloseIcon sx={{ marginRight: "10px" }} />
          Ignore
        </Button>
        <Button
          variant="contained"
          sx={{
            ml: 1,
            backgroundColor: "#1b5e20",
            textTransform: "none", // Set text to normal case
            paddingRight: "10px", // Add padding to the right of the icon
            borderRadius: "20px",
          }}
          // onClick={handleSuggest}
        >
          <CheckIcon sx={{ marginRight: "10px" }} />
          Accept
        </Button>
      </Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box
          sx={{
            height: "fit-content",
            width: "49%",
            paddingLeft: "1%",
            paddingRight: "1%",
            paddingTop: "1%",
            borderRadius: theme.spacing(1),
            backgroundColor: theme.palette.white.main,
            border: `3px solid ${theme.palette.background.neutral}`,
            textAlign: "justify",
          }}
        >
          <Box
            sx={{
              marginBottom: "2%",
            }}
          >
            <PersonIcon
              sx={{
                color: theme.palette.background.neutral,
                marginRight: "10px",
                display: "inline",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme.palette.background.neutral,
                display: "inline",
              }}
            >
              Your Content
            </Typography>
          </Box>
          <LessonPage pageContent={allContents} />
        </Box>
        <Box
          sx={{
            height: "fit-content",
            width: "49%",
            paddingLeft: "1%",
            paddingTop: "1%",
            paddingRight: "1%",
            borderRadius: theme.spacing(1),
            backgroundColor: theme.palette.white.main,
            border: `3px solid ${theme.palette.primary.main}`,
            textAlign: "justify",
          }}
        >
          <Box
            sx={{
              marginBottom: "2%",
            }}
          >
            <VerifiedIcon
              sx={{
                color: theme.palette.primary.main,
                marginRight: "10px",
                display: "inline",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                display: "inline",
              }}
            >
              Suggested Content
            </Typography>
          </Box>
          <LessonPage pageContent={tempSuggestedContent} />
        </Box>
      </Box>
    </Container>
  );
};

export default SuggestContent;

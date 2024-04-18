import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import { LessonsService } from "apis/LessonsService";
import LessonPage from "components/lessonpage/LessonPage";
import FooterControls from "components/lessonpage/FooterControls";
import FilesModal from "components/lessonpage/FilesModal";
import ChatbotDialog from "components/lessonpage/ChatbotDialog";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";

import ChatIcon from "@mui/icons-material/Chat";
import NotificationLayout from "../Notification/NotificationLayout";
import InsightLayout from "../Insight/InsightLayout";

const Lesson = () => {
  const { lessonNumber, pageNumber, isNotif, isInsight } = useParams();
  const convertInsight = isInsight === "true";
  const [insight,setInsight] = useState(convertInsight)
  const notif = isNotif === "true";
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber));
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    console.log("isNotif", notif);
    console.log("isInsight", isInsight);
    getLessonLessonNumber(lessonNumber);
  }, []);

  // useEffect(() => {
  //   console.log("i am rendered");
  //   console.log("rendered insight", insight);
  // }, [insight]);

  const suggestClick = () => {
    console.log("suggest clicked");
    navigate(`/suggest/${lessonNumber}/1/`);
  };

  const insightClicked = () => {
    // console.log("insight clicked");
    // console.log("insight before", insight);
    setInsight(true);
    // console.log("insight after", insight);
  };

  const getLessonLessonNumber = async (lessonNumber) => {
    try {
      const response = await LessonsService.getByLessonNumber(lessonNumber);
      setLesson(response.data);
      console.log("response.data", response.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < lesson?.pages?.length) {
      setCurrentPage((prev) => prev + 1);
      navigate(`/lessons/${lessonNumber}/${currentPage + 1}`);
    } else {
      navigate(`/lessons/${lessonNumber}/end`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      navigate(`/lessons/${lessonNumber}/${currentPage - 1}`);
    } else {
      navigate(`/`);
    }
  };

  const handleEditPage = () => {
    navigate(`/lessons/${lessonNumber}/edit`);
  };

  const handleOpenFiles = () => {
    setFileModalOpen(true);
  };

  const handleCloseFiles = () => {
    setFileModalOpen(false);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <Box>
      <Container
        component="main"
        sx={{
          mt: 2,
          mb: 12,
        }}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <Navigate to="/404" replace />
        ) : (
          <>
            {(notif && !insight) && (
              <NotificationLayout 
              handleSuggest={suggestClick}
              handleInsight={insightClicked}
               />
            )}
            { insight && ( <InsightLayout handleSuggest={suggestClick}/>)

            }
            <LessonPage
              pageContent={lesson?.pages[currentPage - 1]?.contents}
            />
            <FilesModal
              files={lesson?.lesson_files}
              open={fileModalOpen}
              handleClose={handleCloseFiles}
            />
            <Fab
              color="primary"
              onClick={handleOpenChat}
              sx={{
                position: "fixed",
                bottom: "100px",
                right: "50px",
              }}
            >
              <ChatIcon />
            </Fab>
            <ChatbotDialog
              open={isChatOpen}
              handleClose={handleCloseChat}
              lessonId={lesson.id}
              pageId={lesson?.pages[currentPage - 1]?.id}
            />
          </>
        )}
      </Container>
      <FooterControls
        isFirstPage={currentPage === 1}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleEditPage={handleEditPage}
        handleOpenFiles={handleOpenFiles}
      />
    </Box>
  );
};

export default Lesson;

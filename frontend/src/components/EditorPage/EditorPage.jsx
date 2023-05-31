import { Container, Paper, TextField, Button } from "@mui/material";
import {useEffect, useState, useRef } from "react";
import { postLesson, postContent } from "../../apis/Lessons";
import "./EditorPage.css";
import { ContentSlide } from "./ContentSlide";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckIcon from '@mui/icons-material/Check';


export const EditorPage = () => {
  
  const navigate = useNavigate();
  const [contents, setContents] = useState([{}]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const titleChangeHandler = (e) => {
    setTitle(e.target.value);
  }

  const subtitleChangeHandler = (e) => {
    setSubtitle(e.target.value);
  }

  const addPageHandler = () => {
    setContents([...contents, {}]);
  }

  const deletePageHandler = (pageCount) => {
    setContents(contents.filter((content, index) => {
      return index !== pageCount;
    }));
  }

  const textChangeHandler = (index, text) => {
    const _contents = structuredClone(contents);
    _contents[index].content = text;
    setContents(_contents);
  }

  const urlChangeHandler = (index, url) => {
    const _contents = structuredClone(contents);
    _contents[index].url = url;
    setContents(_contents);
  }

  const saveLessonHandler = async () => {
    const lesson = await postLesson(title, subtitle);
    const lessonId = lesson.id;
    contents.forEach(async (content, index) => {
      await postContent(lessonId, index, content.text, content.url);
    });
    navigate(`/`);
  }

  return (
    <>
      <div className="editor-page-backgroundColor"></div>
      <div className="editor-page-container">
        <Container maxWidth="md" className="mt-2rem">
          <Paper elevation={16} className="editor-title-paper" sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
          }}>
            <div className="editor-page-lesson-label">
              Lesson Editor
            </div>
            <div className="editor-page-title-input">
              <span>Title:</span>
              <TextField 
                onChange={(e) => {titleChangeHandler(e)}}
                required
                size="small"
                sx={{
                  width: "70%",
                  marginBottom: "1rem",
                }}>
              </TextField>
              <span>Short Description:</span>
              <TextField 
                onChange={(e) => {subtitleChangeHandler(e)}}
                required
                size="small"
                sx={{
                  width: "70%",
                }}>
              </TextField>
            </div>
          </Paper>

          {contents?.map((content, index) => {
            return (
              <ContentSlide
                key={index}
                content={content}
                index={index}
                onTextChange={textChangeHandler}
                onUrlChange={urlChangeHandler}
                deleteContent={deletePageHandler}/>
            )
          })}

          <div className="editor-page-bottom-controls">
            <Button
              onClick={() => {addPageHandler()}}
              variant="contained"
              fullWidth
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                padding: "0.5rem",
                marginBottom: "1rem",
              }}>
              Add Page
            </Button>
            <Button
              onClick={saveLessonHandler}
              variant="contained"
              fullWidth
              startIcon={<CheckIcon />}
              sx={{
                padding: "0.5rem",
                backgroundColor: "#3F3F3F",
              }}>
              Save
            </Button>
          </div>
        </Container>
      </div>
    </>
  )
};

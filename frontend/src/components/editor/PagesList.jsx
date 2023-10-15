import React, { useState, useEffect, memo, forwardRef } from 'react';

import ReadOnlyPage from './ReadOnlyPage';
import EditorModal from './EditorModal';
import FieldPaper from '../fieldpaper/FieldPaper';

import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Stack,
  Slide,
  Typography
} from '@mui/material';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const PagesList = memo(({ pages, setPages }) => {
  const [openPages, setOpenPages] = useState(Array(pages.length).fill(false));

  const handleOpenPage = (index) => {
    const newOpenPages = [...openPages];
    newOpenPages[index] = true;
    setOpenPages(newOpenPages);
  };

  const handleClosePage = (index) => {
    const newOpenPages = [...openPages];
    newOpenPages[index] = false;
    setOpenPages(newOpenPages);
  };

  const handleUpdatePage = (index, contents) => {
    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages[index].contents = contents;
      return newPages;
    });
  };

  const handleAddPage = () => {
    setPages((prevPages) => [
      ...prevPages,
      {
        contents: `<h1>New Page ${prevPages.length + 1}</h1>`
      }
    ]);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
  };

  const handleRemovePage = (index) => {
    setPages((prevPages) => [
      ...prevPages.filter((page, i) => i !== index)
    ]);
  };

  const handleInsertBelow = (index) => {
    setPages((prevPages) => [
      ...prevPages.slice(0, index + 1),
      {
        contents: `<h1>New Page ${prevPages.length + 1}</h1>`
      },
      ...prevPages.slice(index + 1)
    ]);
  };

  const handleInsertAbove = (index) => {
    setPages((prevPages) => [
      ...prevPages.slice(0, index),
      {
        contents: `<h1>New Page ${prevPages.length + 1}</h1>`
      },
      ...prevPages.slice(index)
    ]);
  };

  const handleMoveUp = (index) => {
    setPages((prevPages) => {
      if (index === 0) return prevPages;
      const newPages = [...prevPages];
      const temp = newPages[index];
      newPages[index] = newPages[index - 1];
      newPages[index - 1] = temp;
      return newPages;
    });
  };

  const handleMoveDown = (index) => {
    setPages((prevPages) => {
      if (index === prevPages.length - 1) return prevPages;
      const newPages = [...prevPages];
      const temp = newPages[index];
      newPages[index] = newPages[index + 1];
      newPages[index + 1] = temp;
      return newPages;
    });
  };

  console.log('I am re-rendering');

  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Pages
      </Typography>
      <Stack divider={<Divider flexItem />} spacing={2}>
        {pages.map((page, index) => (
          <Box key={index}>
            <FieldPaper>
              <Box display='flex'>
                <Box flexGrow={1}>
                  <ReadOnlyPage content={page.contents} />
                </Box>
                <Box
                  display='flex'
                  flexDirection='column'
                  justifyContent='flex-start'>
                  <IconButton
                    onClick={() => handleMoveUp(index)}
                    color='primary'>
                    <ArrowUpwardIcon sx={{ fontSize: '1.2rem' }} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleMoveDown(index)}
                    color='primary'>
                    <ArrowDownwardIcon sx={{ fontSize: '1.2rem' }} />
                  </IconButton>
                </Box>
              </Box>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mt={2}>
                <Box>
                  <Typography variant='caption'>
                    Page {index + 1} of {pages.length}
                  </Typography>
                </Box>
                <Box>
                  <ButtonGroup size='small' variant='text'>
                    <Button onClick={() => handleOpenPage(index)}>Edit</Button>
                    <Button onClick={() => handleInsertAbove(index)}>
                      Insert Above
                    </Button>
                    <Button onClick={() => handleInsertBelow(index)}>
                      Insert Below
                    </Button>
                    <IconButton
                      onClick={() => handleRemovePage(index)}
                      color='error'>
                      <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                    </IconButton>
                  </ButtonGroup>
                </Box>
              </Box>
            </FieldPaper>
            <EditorModal
              contents={page.contents}
              index={index}
              handleUpdatePage={handleUpdatePage}
              open={openPages[index] || false}
              handleClosePage={() => handleClosePage(index)} // Pass the index to close the correct page
              Transition={Transition}
            />
          </Box>
        ))}
        <Box>
          <Button
            onClick={handleAddPage}
            fullWidth
            variant='outlined'
            startIcon={<NoteAddIcon />}>
            Add Page
          </Button>
        </Box>
      </Stack>
    </Box>
  );
});

export default PagesList;

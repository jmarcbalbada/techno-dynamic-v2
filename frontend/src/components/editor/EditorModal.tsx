import React, { useRef } from 'react';

import Editor from './Editor';
import FieldPaper from '../fieldpaper/FieldPaper.jsx';

import {
  AppBar,
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
  Toolbar,
  Container
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

interface EditorRef {
  getHTMLContent: () => string;
  // Add other methods or properties if needed
}

const EditorModal = ({
  contents,
  index,
  handleUpdatePage,
  handleClosePage: handleClose,
  Transition,
  open
}) => {
  const editorRef = useRef<EditorRef | null>(null);

  const handleSave = () => {
    if (editorRef.current) {
      const editorContent = editorRef.current.getHTMLContent();
      handleUpdatePage(index, editorContent);
    }
    handleClose(false);
  };

  const handleCloseWithConfirmation = () => {
    handleClose(true);
  };

  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}>
        <AppBar
          sx={{ color: '#000', background: '#fff', position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleCloseWithConfirmation}
              aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
              Editing Page {index + 1}
            </Typography>
            <Button autoFocus color='inherit' onClick={handleSave}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <Box my={2}>
          <Container>
            <FieldPaper>
              <Editor
                ref={editorRef}
                contents={contents}
                handleSave={handleSave}
              />
            </FieldPaper>
          </Container>
        </Box>
      </Dialog>
    </Box>
  );
};

export default EditorModal;

import React, { useRef } from 'react';

import Editor from './Editor';

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
      console.log('editorContent', editorContent);
      handleUpdatePage(index, editorContent);
    }
    handleClose();
  };

  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleClose}
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
            {/* Add a ref to editor */}
            <Editor
              ref={editorRef}
              contents={contents}
              handleSave={handleSave}
            />
          </Container>
        </Box>
      </Dialog>
    </Box>
  );
};

export default EditorModal;

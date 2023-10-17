import React, { useState, useEffect } from 'react';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

const DeleteLessonDialog = ({ open, handleClose, handleDelete }) => {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDisabled(false);
    }, 3000);
  }, []);

  return (
    <Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure you want to delete this lesson?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography color='error' gutterBottom>
              This will delete all of the lesson's content.
            </Typography>
            <Typography>This action cannot be undone.</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            color='error'
            variant='contained'
            onClick={handleDelete}
            disabled={disabled}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteLessonDialog;

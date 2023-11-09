import React from 'react';
import './QueryConversation.css';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit'; 

const QueryDetailsDialog = ({ isOpen, onClose, selectedRow }) => {
  const handleEditLessonClick = () => {
    // Handle edit lesson logic here
    // For example, navigate to the edit lesson page
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth='md'> 
        <DialogTitle>
          <Box display='flex' justifyContent='space-between'>
            {selectedRow && (
              <Box display='flex' flexDirection='row'>
                <Box className='box-container'>
                  <Typography variant='subtitle2'>
                    Lesson {selectedRow.lessonNumber} - {selectedRow.title}
                  </Typography>
                </Box>
                <Box className='box-container'>
                  <Typography variant='subtitle2'>
                    {selectedRow.firstName} {selectedRow.lastName}
                  </Typography>
                </Box>
                <Box className='box-container'>
                  <Typography variant='subtitle2'>
                    {selectedRow.course} - {selectedRow.year}
                  </Typography>
                </Box>
              </Box>
            )}
            <Box display='flex' alignItems='center' style={{ margin: '-10px' }}>
              <DialogActions>
                <Button
                  onClick={onClose}
                  endIcon={<CloseIcon />}
                >
                  Close
                </Button>
              </DialogActions>
            </Box>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
            {selectedRow && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '500px',
                }}>
                <div className='question-bubble'>
                  <Typography variant='subtitle1'>
                    {selectedRow.question}
                  </Typography>
                </div>
                <div className='response-bubble'>
                  <Typography variant='subtitle1'>
                    {selectedRow.response}
                  </Typography>
                </div>
              </div>
            )}
        </DialogContent>
        <Divider />
          <DialogActions>
            <Button onClick={handleEditLessonClick} startIcon={<EditIcon />} fullWidth>
              Edit Lesson
            </Button>
          </DialogActions>
    </Dialog>
  );
};

export default QueryDetailsDialog;

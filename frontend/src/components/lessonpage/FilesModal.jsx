import React from 'react';

import config from 'data/config';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  Paper,
  styled
} from '@mui/material';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const FilesDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const FilesModal = (props) => {
  const { files, open, handleClose } = props;

  return (
    <FilesDialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ m: 0, p: 2 }}>Files</DialogTitle>
      <DialogContent dividers>
        {files.length === 0 ? (
          <Paper
            variant='outlined'
            sx={{
              p: 2,
              mb: 2
            }}>
            No files for this lesson.
          </Paper>
        ) : (
          files.map((file) => {
            const fileName = file.file.split('/').pop();
            return (
              <Paper
                variant='outlined'
                key={file.id}
                sx={{
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                <PictureAsPdfIcon color='primary' sx={{ mr: 1 }} />
                <Link
                  underline='hover'
                  target='_blank'
                  href={file.file}>
                  {fileName}
                </Link>
              </Paper>
            );
          })
        )}
      </DialogContent>
    </FilesDialog>
  );
};

export default FilesModal;

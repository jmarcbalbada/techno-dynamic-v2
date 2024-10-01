import { useEffect, useRef } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from 'hooks/useAuth';

import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const FooterControls = (props) => {
  const {
    handleNextPage,
    handlePrevPage,
    handleEditPage,
    isFirstPage,
    handleOpenFiles,
    setFooterHeight // This callback will be used to send the height back to Lesson component
  } = props;
  const { user } = useAuth();

  const footerRef = useRef(null); // Use ref to get the footer height

  useEffect(() => {
    if (footerRef.current) {
      const height = footerRef.current.offsetHeight; // Get the height of FooterControls
      setFooterHeight(height); // Pass height back to the parent component
    }
  }, [setFooterHeight]); // Only update when the footer height changes

  return (
    <Paper
      ref={footerRef}
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        py: 2,
        px: 2,
        zIndex: 3000
      }}>
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Button
            onClick={handlePrevPage}
            startIcon={<ArrowBackIcon />}
            variant='outlined'
            size='large'>
            {isFirstPage ? 'Dashboard' : 'Prev'}
          </Button>
          <Box display='flex' gap={1}>
            <Button
              onClick={handleOpenFiles}
              variant='outlined'
              size='large'
              startIcon={<InsertDriveFileIcon />}>
              Files
            </Button>
            {user.role === 'teacher' && (
              <Button onClick={handleEditPage} variant='outlined' size='large'>
                Edit
              </Button>
            )}
          </Box>
          <Button
            onClick={handleNextPage}
            endIcon={<ArrowForwardIcon />}
            variant='outlined'
            size='large'>
            Next
          </Button>
        </Box>
      </Container>
    </Paper>
  );
};

export default FooterControls;

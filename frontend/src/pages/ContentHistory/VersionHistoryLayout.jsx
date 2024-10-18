import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MoveDownIcon from '@mui/icons-material/MoveDown';
const VersionHistoryLayout = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          marginTop: '-17px',
          padding: '20px',
          borderRadius: '5px',
          bgcolor: theme.palette.background.neutral,
          height: 'fit-content',
          mt: 0
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}>
          <MoveDownIcon sx={{ color: '#fff', marginRight: '10px' }} />
          <Typography
            variant='body2'
            sx={{
              color: '#fff',
              flex: 1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}>
            This section allows you to restore versions that you have modified
            or that have been modified by AI. Give it a try!
          </Typography>
        </div>
      </Box>
    </>
  );
};

export default VersionHistoryLayout;

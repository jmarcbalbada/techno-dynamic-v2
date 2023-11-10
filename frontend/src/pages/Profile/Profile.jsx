import React from 'react';

import { useAuth } from 'hooks/useAuth';

import {
  Box,
  Paper,
  Container,
  Typography,
  TextField,
  styled,
  Divider,
  Chip
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';

const Profile = () => {
  const { user } = useAuth();
  console.log(user);

  const renderUserType = () => {
    if (user?.role === 'student') {
      return (
        <>
          <Divider
            textAlign='left'
            sx={{
              my: 2,
              '&::before': {
                display: 'none',
                padding: 0
              },
              '.MuiDivider-wrapper': {
                paddingLeft: 0
              }
            }}>
            <Chip label='Student Information' variant='outlined' />
          </Divider>
          <Box display='flex' flexDirection='column'>
            <Typography
              variant='body2'
              sx={{
                fontStyle: 'italic'
              }}>
              Year Level
            </Typography>
            <Typography variant='h6' gutterBottom>
              {user?.student_data?.year}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontStyle: 'italic'
              }}>
              Course
            </Typography>
            <Typography variant='h6' gutterBottom>
              {user?.student_data?.course}
            </Typography>
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Divider
            textAlign='left'
            sx={{
              my: 2,
              '&::before': {
                display: 'none',
                padding: 0
              },
              '.MuiDivider-wrapper': {
                paddingLeft: 0
              }
            }}>
            <Chip label='Instructor Information' variant='outlined' />
          </Divider>
          <Box display='flex' gap={1}>
            <Typography variant='h5' gutterBottom>
              Instructor Account
            </Typography>
            <CheckIcon sx={{ color: 'green', fontSize: '1.7rem' }} />
          </Box>
        </>
      );
    }
  };

  return (
    <Container>
      <Box>
        <h1>{user?.first_name}'s Profile</h1>
        <Box width={1} display='flex' flexDirection='column' gap={1}>
          <Box>
            <Paper
              variant='outlined'
              sx={{
                p: 2,
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
              }}>
              <Divider
                textAlign='left'
                sx={{
                  mb: 2,
                  '&::before': {
                    display: 'none',
                    padding: 0
                  },
                  '.MuiDivider-wrapper': {
                    paddingLeft: 0
                  }
                }}>
                <Chip label='Basic Information' variant='outlined' />
              </Divider>
              <Box display='flex' flexDirection='column'>
                <Typography
                  variant='body2'
                  sx={{
                    fontStyle: 'italic'
                  }}>
                  First Name
                </Typography>
                <Typography variant='h6' gutterBottom>
                  {user?.first_name}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    fontStyle: 'italic'
                  }}>
                  Last Name
                </Typography>
                <Typography variant='h6' gutterBottom>
                  {user?.last_name}
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    fontStyle: 'italic'
                  }}>
                  Email
                </Typography>
                <Typography variant='h6' gutterBottom>
                  {user?.email}
                </Typography>
                {renderUserType()}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;

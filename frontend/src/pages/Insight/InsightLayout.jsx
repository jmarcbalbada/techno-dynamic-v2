import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { useTheme } from '@mui/material';
import LessonPage from 'components/lessonpage/LessonPage';
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';

const InsightLayout = ({ handleSuggest, sampleContentReal,suggestionLoading }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const sampleContent = String(sampleContentReal);
  const headerFaqQuestions =
    '<b><h4>These are the questions under these insights:</h4><br></b>';

  const modifiedContent = headerFaqQuestions + sampleContent.replace('1. ', '');

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
          bgcolor: '#e6b800',
          height: 'fit-content',
          marginBottom: '2%'
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}>
          <TipsAndUpdatesIcon sx={{ color: '#fff', marginRight: '10px' }} />
          <Typography
            variant='body1'
            sx={{
              color: '#fff',
              flex: 1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}>
            Here's how to strengthen your content ...
          </Typography>
          <Box sx={{ display: 'flex' }}>
              {suggestionLoading ? (
                  "Loading..." // Display loading indicator when data is being fetched
              ) : (
                  <Button
                      variant='contained'
                      sx={{
                          ml: 1,
                          backgroundColor: '#1b5e20',
                          textTransform: 'none',
                          paddingRight: '10px'
                      }}
                      onClick={handleSuggest}
                  >
                      <HandshakeOutlinedIcon sx={{ marginRight: '10px' }} />
                      Suggest Content
                  </Button>
              )}
          </Box>
        </div>
      </Box>
      <Box
        sx={{
          position: 'relative',
          height: 'fit-content',
          marginBottom: '4%'
        }}>
        <Box
          sx={{
            backgroundColor: theme.palette.background.lighterneutral,
            borderRadius: theme.spacing(3),
            height: 'fit-content',
            width: '100%'
          }}>
          <Box
            sx={{
              marginLeft: '2%',
              marginRight: '2%',
              paddingTop: '1%',
              lineHeight: 1.8,
              paddingBottom: '20px'
            }}>
            <LessonPage pageContent={modifiedContent} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default InsightLayout;

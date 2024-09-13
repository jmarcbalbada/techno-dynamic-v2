import React, { useEffect, useState } from 'react';
import { LessonsService } from 'apis/LessonsService';
import { SuggestionService } from 'apis/SuggestionService';
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';
import { Typography, Box, Button, Tooltip } from '@mui/material';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import Container from '@mui/material/Container';
import LessonPage from 'components/lessonpage/LessonPage';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { NotificationService } from '../../apis/NotificationService';
import Skeleton from '@mui/material/Skeleton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const SuggestContent = () => {
  const { lessonNumber, pageNumber, lessonID } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [allContents, setAllContents] = useState('');
  const [suggestedContents, setSuggestedContents] = useState([]);
  const theme = useTheme();
  const currID = parseInt(lessonID);

  const temp = String(suggestedContents);
  const finalSuggestContent = temp.replace('2. ', '');

  const handleAccept = () => {
    // console.log("clicked accept");
    handleNewContent();
    navigate(`/lessons/${lessonNumber}/${pageNumber}/${currID}/rvContent`, {
      replace: true
    });
    window.history.pushState(null, null, window.location.href);
  };

  const handleNewContent = async () => {
    try {
      const response = await SuggestionService.accept_content(currID);
      console.log('response', response.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getSkeletonLoading = () => {
    return (
      <>
        <Typography variant='body2'>
          Please wait and refrain from refreshing while we load your content...
        </Typography>
        <Skeleton
          variant='rounded'
          height={150}
          sx={{ marginTop: '5%', marginBottom: '10px' }}
        />
        <Skeleton
          variant='rounded'
          height={70}
          sx={{ marginTop: '5%', marginBottom: '10px' }}
        />
        <Skeleton
          variant='rounded'
          height={20}
          sx={{ marginTop: '2%', marginBottom: '5px' }}
        />

        <Skeleton
          variant='rounded'
          height={20}
          sx={{ marginTop: '2%', marginBottom: '5px' }}
        />

        <Skeleton
          variant='rounded'
          height={20}
          sx={{ marginTop: '2%', marginBottom: '20px' }}
        />

        <Skeleton variant='rounded' height={70} sx={{ marginBottom: '10px' }} />

        <Skeleton
          variant='rounded'
          height={20}
          sx={{ marginTop: '2%', marginBottom: '5px' }}
        />

        <Skeleton
          variant='rounded'
          height={20}
          sx={{ marginTop: '2%', marginBottom: '5px' }}
        />

        <Skeleton
          variant='rounded'
          height={20}
          sx={{ marginTop: '2%', marginBottom: '20px' }}
        />
        <Skeleton variant='rounded' height={70} sx={{ marginBottom: '10px' }} />

        <Skeleton
          variant='rounded'
          height={20}
          sx={{ marginTop: '2%', marginBottom: '5px' }}
        />

        <Skeleton
          variant='rounded'
          height={20}
          sx={{ marginTop: '2%', marginBottom: '5px' }}
        />

        <Skeleton
          variant='rounded'
          height={20}
          sx={{ marginTop: '2%', marginBottom: '20px' }}
        />
      </>
    );
  };

  const handleIgnore = () => {
    // console.log("clicked ignore");
    handleClearCallbackSuggestionAndNotification();
    navigate(`/`);
  };

  const handleClearCallbackSuggestionAndNotification = async () => {
    await handleClearNotif();
    await handleClearSuggestionAndFaq();
    navigate(`/`);
  };

  const handleClearNotif = async () => {
    try {
      const response = await NotificationService.deleteNotifByLessonId(currID);
      // setLesson(response.data);
      console.log('response.data', response.data);
    } catch (error) {
      setIsError(true);
    } finally {
    }
  };

  const handleClearSuggestionAndFaq = async () => {
    try {
      const response = await SuggestionService.delete_suggestion(currID);
      // setLesson(response.data);
      console.log('response.data', response.data);
    } catch (error) {
      setIsError(true);
    } finally {
    }
  };

  useEffect(() => {
    getLessonLessonNumber(lessonNumber);
    getSuggestionContent();
  }, []);

  const getLessonLessonNumber = async (lessonNumber) => {
    try {
      const response = await LessonsService.getByLessonNumber(lessonNumber);
      setLesson(response.data);
      setTotalPage(response.data.pages.length);

      // Concatenate contents of all pages
      let contents = '';
      response.data.pages.forEach((page) => {
        contents += page.contents;
      });
      setAllContents(contents);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestionContent = async () => {
    try {
      const notif_id = localStorage.getItem('notification_id');
      console.log('notif id', notif_id);
      if (notif_id) {
        const response = await SuggestionService.create_content(
          currID,
          notif_id
        );
        // console.log('response.data', response.data);
        // setSuggestedContents(response.data.content);
        console.log('response.data', response.data);
        setSuggestedContents(response.data.ai_response);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('error', error);
      setIsError(true);
    } finally {
    }
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    getSkeletonLoading();
    await getSuggestionContent();
    setIsLoading(false);
  };

  return (
    <Container component='main' sx={{ mt: 2, mb: 12 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          marginTop: '-17px',
          padding: '20px',
          borderRadius: '5px',
          bgcolor: theme.palette.primary.main,
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
          <VerifiedIcon sx={{ color: '#fff', marginRight: '10px' }} />
          <Typography
            variant='body1'
            sx={{
              color: '#fff',
              flex: 1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}>
            Suggested content for you!
          </Typography>
        </div>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '4px'
        }}>
        <Button
          variant='contained'
          color='primary'
          sx={{
            backgroundColor: theme.palette.background.danger,
            '&:hover': {
              backgroundColor: '#761e1e'
            },
            textTransform: 'none', // Set text to normal case
            paddingRight: '10px', // Add padding to the right of the icon
            borderRadius: '20px'
          }}
          onClick={handleIgnore}>
          <CloseIcon sx={{ marginRight: '10px' }} />
          Ignore
        </Button>
        <Button
          variant='contained'
          sx={{
            ml: 1,
            backgroundColor: '#1b5e20',
            textTransform: 'none', // Set text to normal case
            paddingRight: '10px', // Add padding to the right of the icon
            borderRadius: '20px'
          }}
          onClick={handleAccept}>
          <CheckIcon sx={{ marginRight: '10px' }} />
          Accept
        </Button>
      </Box>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        <Box
          sx={{
            // height: "fit-content",
            height: '800px',
            overflowY: 'auto',
            width: '49%',
            paddingLeft: '1%',
            paddingRight: '1%',
            paddingTop: '1%',
            borderRadius: theme.spacing(1),
            backgroundColor: theme.palette.white.main,
            border: `3px solid ${theme.palette.background.neutral}`,
            textAlign: 'justify'
          }}>
          <Box
            sx={{
              marginBottom: '2%'
            }}>
            <PersonIcon
              sx={{
                color: theme.palette.background.neutral,
                marginRight: '10px',
                display: 'inline'
              }}
            />
            <Typography
              variant='h6'
              sx={{
                fontWeight: 'bold',
                color: theme.palette.background.neutral,
                display: 'inline'
              }}>
              Your Content
            </Typography>
          </Box>
          <LessonPage pageContent={allContents} />
        </Box>
        <Box
          sx={{
            // height: "fit-content",
            height: '800px',
            overflowY: 'auto',
            width: '49%',
            paddingLeft: '1%',
            paddingTop: '1%',
            paddingRight: '1%',
            borderRadius: theme.spacing(1),
            backgroundColor: theme.palette.white.main,
            border: `3px solid ${theme.palette.primary.main}`,
            textAlign: 'justify'
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2%'
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VerifiedIcon
                sx={{
                  color: theme.palette.primary.main,
                  marginRight: '10px',
                  display: 'inline'
                }}
              />
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                  display: 'inline'
                }}>
                Suggested Content
              </Typography>
            </Box>
            <Tooltip title='Generate again'>
              <RestartAltIcon
                sx={{
                  fontSize: '24px',
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  '&:hover': {
                    cursor: 'pointer'
                  }
                }}
                onClick={handleRegenerate}
              />
            </Tooltip>
          </Box>
          {/* Conditional rendering based on finalSuggestContent */}
          {isLoading || !finalSuggestContent ? (
            <>{getSkeletonLoading()}</>
          ) : (
            <LessonPage pageContent={finalSuggestContent} />
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default SuggestContent;

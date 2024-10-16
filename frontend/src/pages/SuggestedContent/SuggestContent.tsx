import React, { useEffect, useState, useRef } from 'react';
import { LessonsService } from 'apis/LessonsService';
import { SuggestionService } from 'apis/SuggestionService';
import { ContentHistoryService } from 'apis/ContentHistoryService';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Tooltip } from '@mui/material';
import Container from '@mui/material/Container';
import LessonPage from 'components/lessonpage/LessonPage';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Skeleton from '@mui/material/Skeleton';
import { clsx } from 'clsx';
import CreateIcon from '@mui/icons-material/Create';
import Editor from 'components/editor/Editor';
import { NotificationService } from 'apis/NotificationService';

const SuggestContent = () => {
  const { lessonNumber, pageNumber, lessonID } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [allContents, setAllContents] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [suggestedContents, setSuggestedContents] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(
    'Please wait and refrain from refreshing while we load your content...'
  );
  const theme = useTheme();
  const currID = parseInt(lessonID);
  const editorRef = useRef(null);
  const [fade, setFade] = useState(true); // Control the fade effect

  useEffect(() => {
    // Store the timeout IDs so we can clear them later
    const timeouts = [];

    const updateMessage = (newMessage, delay) => {
      const timeoutId = setTimeout(() => {
        setFade(false); // Start fading out
        const fadeOutTimeout = setTimeout(() => {
          setLoadingMessage(newMessage); // Change the message
          setFade(true); // Start fading in
        }, 1000); // Delay for 1 second to allow fading out

        // Store the fade-out timeout ID so we can clear it if needed
        timeouts.push(fadeOutTimeout);
      }, delay);

      // Store the timeout ID so we can clear it if needed
      timeouts.push(timeoutId);
    };

    // Change messages with delays
    updateMessage('Hang in there, it may take some time...', 7000); // 7 seconds before this message shows
    updateMessage('Almost there, we are beautifying your content...', 14000); // 7 more seconds before this message

    return () => {
      // Clear all timeouts when component unmounts or loading is complete
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);

  const handleAccept = async () => {
    // Save the suggested content
    await handleSave();
    await handleClearNotif();
    await handleAddVersionControl();
    // Wait for the response from handleNewContent
    // await handleNewContent(allContents);
    await handleNewContent(suggestedContents);

    // Add a delay of 1 second before navigating
    setTimeout(() => {
      navigate(`/lessons/${lessonNumber}/${pageNumber}/${currID}/rvContent`, {
        replace: true
      });
      window.history.pushState(null, null, window.location.href);
    }, 500);
  };

  const handleAddVersionControl = async () => {
    try {
      const response = await ContentHistoryService.createHistory(
        currID,
        allContents
      );
      console.log('historyId', response.data);
      await localStorage.setItem('historyId', response.data.historyId);
    } catch (error) {
      console.log('Error', error);

      setIsError(true);
    }
  };

  const handleClearNotif = async () => {
    try {
      let notifId;
      if (localStorage.getItem('notification_id')) {
        notifId = parseInt(localStorage.getItem('notification_id'), 10);
      }
      if (notifId) {
        // Delete notification by notifId
        const response =
          await NotificationService.deleteNotificationById(notifId);
        console.log('notifId', notifId);
        console.log('response.data', response.data);
      }
    } catch (error) {
      setIsError(true);
    }
  };

  const handleClearSuggestionAndFaq = async () => {
    try {
      const response = await SuggestionService.delete_suggestion(currID);
      // console.log('response.data', response.data);
    } catch (error) {
      setIsError(true);
    }
  };

  const handleSave = () => {
    let finalChanges = '';

    // if edit and save right away
    if (isEditing) {
      finalChanges = editorRef.current.getHTMLContent();
    } else {
      finalChanges = suggestedContents;
    }

    // Clean the content in the handleSave function

    // 1. Remove <mark> tags with 'lightcoral' background and their content
    finalChanges = finalChanges.replace(
      /<mark\s+style\s*=\s*"background-color\s*:\s*lightcoral\s*;">.*?<\/mark>/gi,
      ''
    );

    // 2. Remove <mark> and </mark> tags but retain the content inside them (for yellow marks)
    finalChanges = finalChanges.replace(/<\/?mark(?:\s+[^>]+)?>/gi, '');

    // 3. Remove newline characters
    finalChanges = finalChanges.replace(/\n/g, '');

    // 4. Remove any instances of '**'
    finalChanges = finalChanges.replace(/\*\*/g, '');

    // 5. Remove any instances of '```html'
    finalChanges = finalChanges.replace(/```html/g, '');

    // set suggested contents
    setSuggestedContents(finalChanges);

    // return finalChanges if needed
  };

  // const handleSave = () => {
  //   let finalChanges = '';

  //   // if edit and save right away
  //   if (isEditing) {
  //     finalChanges = editorRef.current.getHTMLContent();
  //   } else {
  //     finalChanges = suggestedContents;
  //   }

  //   // set suggested contents
  //   setSuggestedContents(finalChanges);

  //   // return finalChanges
  // };

  const handleEditedChanges = () => {
    setIsEditing(false);
    setSuggestedContents(editorRef.current.getHTMLContent());
  };

  const handleNewContent = async (newData) => {
    // console.log('newContent');

    try {
      const response = await SuggestionService.accept_content(currID, newData);
      // console.log('response', response.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIgnore = () => {
    handleClearCallbackSuggestionAndNotification();
    navigate(`/`);
  };

  const handleClearCallbackSuggestionAndNotification = async () => {
    await handleClearNotif();
    await handleClearSuggestionAndFaq();
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      getLessonLessonNumber(lessonNumber);
      getSuggestionContent();
      hasFetched.current = true;
    }
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
      // Do not set isLoading to false here if you have other async operations
    }
  };

  const getSuggestionContent = async () => {
    try {
      const notif_id = localStorage.getItem('notification_id');

      // Add 3-minute timeout if request is rejected
      if (notif_id) {
        const response = await SuggestionService.create_content(
          currID,
          notif_id
        );

        console.log('ai_response', response.data.ai_response);

        // Convert to string and replace '```html' with an empty string
        let removeTagContents = response.data.ai_response.replace(
          /```html/g,
          ''
        );

        setSuggestedContents(removeTagContents);

        // console.log('response.data.ai_response', aiResponse);
      }
    } catch (error) {
      console.log('error', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    await getSuggestionContent();
    setIsLoading(false);
  };
  const getSkeletonLoading = () => {
    return (
      <>
        {/* <Typography variant='body2'>
          Please wait and refrain from refreshing while we load your content...
        </Typography> */}
        <Box
          sx={{
            opacity: fade ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}>
          <Typography variant='body2'>{loadingMessage}</Typography>
        </Box>
        {/* loadingMessage */}
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
      </>
    );
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
        {!isLoading && (
          <Button
            variant='contained'
            color='primary'
            sx={{
              backgroundColor: theme.palette.background.danger,
              '&:hover': {
                backgroundColor: '#761e1e'
              },
              textTransform: 'none',
              paddingRight: '10px',
              borderRadius: '20px'
            }}
            onClick={handleIgnore}
            disabled={isLoading}>
            <CloseIcon sx={{ marginRight: '10px' }} />
            Ignore
          </Button>
        )}
        <Button
          variant='contained'
          sx={{
            ml: 1,
            backgroundColor: '#1b5e20',
            textTransform: 'none',
            paddingRight: '10px',
            borderRadius: '20px'
          }}
          onClick={handleAccept}
          disabled={isLoading}>
          <CheckIcon sx={{ marginRight: '10px' }} />
          Accept
        </Button>
      </Box>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        {/* Left Side - Your Content */}
        <Box
          sx={{
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
          <Box sx={{ marginBottom: '2%' }}>
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
        {/* Right Side - Suggested Content */}
        <Box
          sx={{
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
            {!isEditing && !isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title='Edit this content'>
                  <CreateIcon
                    sx={{
                      fontSize: '24px',
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      '&:hover': {
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  />
                </Tooltip>
                <Tooltip title='Generate again'>
                  <RestartAltIcon
                    sx={{
                      fontSize: '24px',
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      ml: 2, // Adjust this value to control spacing between the icons
                      '&:hover': {
                        cursor: 'pointer'
                      }
                    }}
                    className={clsx(isLoading && 'hidden')}
                    onClick={handleRegenerate}
                  />
                </Tooltip>
              </Box>
            )}

            {isEditing && (
              <Tooltip title='Save and preview'>
                <CheckIcon
                  sx={{
                    fontSize: '24px',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    '&:hover': {
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => {
                    // setIsEditing(false);
                    handleEditedChanges();
                  }}
                />
              </Tooltip>
            )}
          </Box>
          {/* Conditional rendering based on isLoading and suggestedContents */}
          {isError ? (
            <div>
              <p>
                Something went wrong with your internet connection. Please try
                again later.
              </p>
            </div>
          ) : isLoading ? (
            getSkeletonLoading()
          ) : !isEditing && suggestedContents ? (
            <LessonPage pageContent={suggestedContents} />
          ) : (
            isEditing && <Editor ref={editorRef} contents={suggestedContents} />
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default SuggestContent;

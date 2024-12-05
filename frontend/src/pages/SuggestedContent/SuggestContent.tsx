//@ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { LessonsService } from 'apis/LessonsService';
import { SuggestionService } from 'apis/SuggestionService';
import { ContentHistoryService } from 'apis/ContentHistoryService';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Snackbar,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import Container from '@mui/material/Container';
import LessonPage from 'components/lessonpage/LessonPage';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from '@mui/material/Skeleton';
import CreateIcon from '@mui/icons-material/Create';
import Editor from 'components/editor/Editor';
import MuiAlert from '@mui/material/Alert';
import { NotificationService } from 'apis/NotificationService';
import cleanMarkAiContent, {
  CleanMarkAiContent
} from '../../helpers/CleanMarkAiContent';
import { insertDelimitersAtPositions } from '../../utils/insertDelimitersAtPositions';

const SuggestContent = () => {
  const { lessonNumber, pageNumber, lessonID } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [allContents, setAllContents] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [cleanedVersion, setCleanedVersion] = useState('');
  const [suggestedContents, setSuggestedContents] = useState('');
  const original_suggestion_content = useRef<string>('');
  const [loadingMessage, setLoadingMessage] = useState(
    'Please wait and refrain from refreshing while we load your content...'
  );
  const theme = useTheme();
  const currID = parseInt(lessonID);
  const editorRef = useRef(null);
  let isEditCounter = useRef(0);

  const [fade, setFade] = useState(true); // Control the fade effect
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

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
    updateMessage('Hang in there, it may take some time...', 2000); // 7 seconds before this message shows
    // updateMessage('Almost there, we are beautifying your content...', 14000); // 7 more seconds before this message

    return () => {
      // Clear all timeouts when component unmounts or loading is complete
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);
  const finalChanges = () => {
    let changes = editorRef.current.getHTMLContent();
    changes = CleanMarkAiContent(changes);

    // Reinsert delimiters if necessary
    if (isEditing) {
      let originalDelimiterPositions = getDelimiterPositions(suggestedContents);
      changes = insertDelimitersAtPositions(
        finalChanges,
        originalDelimiterPositions
      );
    }
    return;
  };
  const handleAccept = async () => {
    setOpenSnackbar(true);
    // Save the suggested content
    setIsLoading(true);
    const updatedContent = await handleSave();
    if (updatedContent != 'error') {
      console.log(
        'updatedContent suggestion papges handleSvae return:',
        updatedContent
      );
      await handleNewContent(updatedContent);
      await handleClearNotif();
      await handleAddVersionControl();

      // Wait for the response from handleNewContent
      setIsLoading(false);

      setTimeout(() => {
        window.location.replace(
          `/lessons/${lessonNumber}/${pageNumber}/${currID}/rvContent`
        );
        setOpenSnackbar(false);
      }, 500);
    }
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

  // Utility to find positions of the `<!-- delimiter -->` in content
  const getDelimiterPositions = (content) => {
    const positions = [];
    let index = content.indexOf('<!-- delimiter -->');

    while (index !== -1) {
      positions.push(index);
      index = content.indexOf('<!-- delimiter -->', index + 1);
    }

    return positions;
  };

  // Utility to insert `<!-- delimiter -->` at specified positions

  // const handleSave = () => {
  //   // Start with the current content based on the editing state
  //   let finalChanges = '';

  //   if (isEditing || wasEdited) {
  //     finalChanges = editorRef.current.getHTMLContent() || editedContent;
  //   } else {
  //     finalChanges = suggestedContents;
  //   }

  //   // if (isEditing) {
  //   //   finalChanges = editorRef.current.getHTMLContent();
  //   // } else if (wasEdited) {
  //   //   finalChanges = editedContent;
  //   // } else if (!isEditing && !wasEdited) {
  //   //   finalChanges = suggestedContents;
  //   // }

  //   // Clean up content and remove any leftover delimiters
  //   finalChanges = CleanMarkAiContent(finalChanges);

  //   // Prepare to reinsert delimiters if necessary
  //   if (isEditing || wasEdited) {
  //     console.log('isEditing: ', isEditing, 'wasEdited: ', wasEdited);

  //     let originalDelimiterPositions = [];
  //     originalDelimiterPositions = getDelimiterPositions(suggestedContents);

  //     // Reinsert `<!-- delimiter -->` at the initial positions
  //     finalChanges = insertDelimitersAtPositions(
  //       finalChanges,
  //       originalDelimiterPositions
  //     );
  //   }

  //   // Update suggestedContents state with the cleaned and adjusted content
  //   // setSuggestedContents(finalChanges);

  //   return finalChanges;
  // };

  const handleSave = async () => {
    // wala sya na click
    // not edited at all
    // let notifId = localStorage.getItem('notifId');
    let notifId = parseInt(localStorage.getItem('notification_id'), 10);

    if (isEditCounter.current == 0) {
      console.log('suggestion content response:', suggestedContents);
      return cleanMarkAiContent(suggestedContents);
    }
    if (isEditing) {
      try {
        const editedContent = editorRef.current.getHTMLContent();
        console.log('edited', editedContent);
        console.log('original_suggestion_content', original_suggestion_content);
        let get_insert_delimiter_ai =
          await SuggestionService.get_insert_delimiter_ai(currID, notifId);
        console.log(
          'get_insert_delimiter_ai map ni sya ',
          get_insert_delimiter_ai
        );
        if (get_insert_delimiter_ai.data.success) {
          return CleanMarkAiContent(get_insert_delimiter_ai.data.data);
        }
        const query = await SuggestionService.insert_delimiter_ai(
          editedContent,
          original_suggestion_content.current,
          currID,
          notifId
        );
        console.log('edited content', editedContent);
        console.log('original content', original_suggestion_content);
        console.log('get ai delimiter query ', query);

        if (!query.data.success) {
          return 'error';
        }

        let flag = true;
        while (flag) {
          get_insert_delimiter_ai =
            await SuggestionService.get_insert_delimiter_ai(currID, notifId);
          console.log('get_insert_delimiter_ai', get_insert_delimiter_ai);
          if (get_insert_delimiter_ai.data.success == true) {
            console.log('im sorry i stoped 6969');
            flag = false;
            break;
          }
          // Delay for 5 seconds
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        console.log('get ai delimiter result: ', get_insert_delimiter_ai);
        return cleanMarkAiContent(get_insert_delimiter_ai.data.data);
        console.log('end');
        // return 'error';
      } catch (e) {
        console.log('Error 12123', e);
        throw new Error('Suggest content delimeter ai error');
      }
    }
    if (!isEditing) {
      try {
        const notifId = parseInt(localStorage.getItem('notification_id'), 10);
        let get_insert_delimiter_ai =
          await SuggestionService.get_insert_delimiter_ai(currID, notifId);
        if (get_insert_delimiter_ai.data.success) {
          return CleanMarkAiContent(get_insert_delimiter_ai.data.data);
        }

        // Start background process
        const query = await SuggestionService.insert_delimiter_ai(
          cleanedVersion,
          original_suggestion_content.current,
          currID,
          notifId
        );
        console.log('get ai delimiter query ', query);

        if (!query.data.success) {
          return 'error';
        }

        let flag = true;
        while (flag) {
          get_insert_delimiter_ai =
            await SuggestionService.get_insert_delimiter_ai(currID, notifId);
          if (get_insert_delimiter_ai.data.success) {
            flag = false;
            break;
          }
          // Delay for 5 seconds
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        console.log('get ai delimiter result: ', get_insert_delimiter_ai);
        return cleanMarkAiContent(get_insert_delimiter_ai.data.data);
      } catch (e) {
        throw new Error('Suggest content delimiter AI error');
      }
    }
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
    var refCleaned = CleanMarkAiContent(editorRef.current.getHTMLContent());
    setCleanedVersion(refCleaned);
    setSuggestedContents(editorRef.current.getHTMLContent());
  };

  const handleNewContent = async (newData) => {
    // console.log('newContent');
    console.log('handleNewContent suggestion content new data', newData);
    console.log(
      'handleNewContent suggestion content handle new content currid',
      currID
    );
    try {
      const response = await SuggestionService.accept_content(currID, newData);
      // console.log('response', response.data);
      console.log('handleNewContent suggestion content response', response);
    } catch (error) {
      console.log('handleNewContent suggestion content error');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIgnore = () => {
    handleClearCallbackSuggestionAndNotification();
    // navigate(`/`);
    window.location.replace('/'); // Replaces the current URL and reloads the page
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

    // check old content on local
    getOldContentIfExist();
  }, []);

  const getOldContentIfExist = async () => {
    if (!localStorage.getItem('ol1cnt2')) {
      const responseOldContent =
        await SuggestionService.get_old_content(currID);
      // set to local storage
      localStorage.setItem('ol1cnt2', responseOldContent.data.old_content);
    }
  };

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

      if (notif_id) {
        const response = await SuggestionService.create_content(
          currID,
          notif_id
        );

        // Safely access response data
        const suggestion = response.data?.suggestion || [];
        const pending = response.data?.isPending ?? false;

        setIsPending(pending); // Set isPending in state

        if (pending) {
          setSuggestedContents(
            'Content is still processing, please come back within 1-2 minutes...'
          );

          // Shorter delay for pending content
          setTimeout(() => {
            setFade(false); // Start fading out the loading message
            setTimeout(() => {
              setIsLoading(false); // Mark loading as complete after fade-out
              setFade(true); // Reset fade effect for future use
            }, 1000); // Allow fade-out to complete
          }, 2000); // Ensure skeleton is visible for at least 2 seconds
        } else if (suggestion.length > 0 && suggestion[0].content) {
          let removeTagContents = suggestion[0].content.replace(/```html/g, '');
          removeTagContents = removeTagContents.replace(/```/g, '');
          setSuggestedContents(removeTagContents);
          original_suggestion_content.current = removeTagContents;
          // Slightly longer delay for loading completed content
          setTimeout(() => {
            setFade(false); // Start fading out the loading message
            setTimeout(() => {
              setIsLoading(false); // Mark loading as complete after fade-out
              setFade(true); // Reset fade effect for future use
            }, 1000); // Allow fade-out to complete
          }, 4000); // Ensure skeleton is visible for at least 3 seconds
        } else {
          setSuggestedContents('No content available.');
          setIsLoading(false); // Stop loading immediately if no content
        }
      }
    } catch (error) {
      console.log('error', error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    // Start loading and fade effect
    setIsLoading(true);
    setFade(true);

    // Call to get suggestion content
    await getSuggestionContent();

    // Introduce a 3-4 second delay for the loading skeleton
    setTimeout(() => {
      setFade(false); // Start fading out the loading message

      setTimeout(() => {
        setIsLoading(false); // Mark loading as complete after fade-out
        setFade(true); // Reset fade effect for future use
      }, 1000); // Allow fade-out to complete
    }, 3000); // Ensure skeleton is visible for at least 3 seconds
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
              '&:hover': { backgroundColor: '#761e1e' },
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
              <Tooltip title='AI can make mistakes, consider to recheck the contents!'>
                <VerifiedIcon
                  sx={{
                    color: theme.palette.primary.main,
                    marginRight: '10px',
                    display: 'inline'
                  }}
                />
              </Tooltip>
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
                      '&:hover': { cursor: 'pointer' }
                    }}
                    onClick={() => {
                      isEditCounter = isEditCounter.current += 1;
                      setIsEditing(true);
                    }}
                  />
                </Tooltip>
                {/* <Tooltip title='Generate again'>
                  <RestartAltIcon
                    sx={{
                      fontSize: '24px',
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      ml: 2,
                      '&:hover': { cursor: 'pointer' }
                    }}
                    className={clsx(isLoading && 'hidden')}
                    onClick={handleRegenerate}
                  />
                </Tooltip> */}
              </Box>
            )}

            {isEditing && !isLoading && (
              <Tooltip title='Save and preview'>
                <CheckIcon
                  sx={{
                    fontSize: '24px',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    '&:hover': { cursor: 'pointer' }
                  }}
                  onClick={() => {
                    handleEditedChanges();
                  }}
                />
              </Tooltip>
            )}
          </Box>
          {/* Conditional rendering based on isLoading and suggestedContents */}
          {isError ? (
            <div>
              <p>Oops, something went wrong. Please try again later!</p>
            </div>
          ) : isLoading ? (
            getSkeletonLoading() // Display loading skeleton while isLoading is true
          ) : isPending ? (
            <Typography variant='body2' color='text.secondary'>
              Content is still processing, please come back later.
            </Typography>
          ) : !isEditing && suggestedContents ? (
            <LessonPage pageContent={suggestedContents} />
          ) : (
            isEditing && <Editor ref={editorRef} contents={suggestedContents} />
          )}
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity='success'>
          Saving changes, please wait.
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default SuggestContent;

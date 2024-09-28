// SuggestContent.jsx

import React, { useEffect, useState, useRef } from 'react';
import { LessonsService } from 'apis/LessonsService';
import { SuggestionService } from 'apis/SuggestionService';
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
import Editor from 'components/editor/Editor'; // Import the Editor component
import { NotificationService } from 'apis/NotificationService';

const SuggestContent = () => {
    const { lessonNumber, pageNumber, lessonID } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [allContents, setAllContents] = useState('');
    const [suggestedContents, setSuggestedContents] = useState('');
    const theme = useTheme();
    const currID = parseInt(lessonID);
    const editorRef = useRef(null);

    const handleAccept = () => {
        console.log('hanldeAccept');
        const newsuggestedContent = handleSave();
        handleNewContent(newsuggestedContent);
        navigate(`/lessons/${lessonNumber}/${pageNumber}/${currID}/rvContent`, {
            replace: true,
        });
        window.history.pushState(null, null, window.location.href);
    };

    const handleSave = () => {
        if (editorRef.current) {
            console.log('handleSave');
            const editorContent = editorRef.current.getHTMLContent();
            // Handle the updated content here, e.g., update the lesson content with editorContent
            console.log('Editor Content:', editorContent);
            // You can call an API to save the content if needed
            return editorContent
        }
    };
    const handleNewContent = async (newData) => {
        console.log('newContent');

        try {
            const response = await SuggestionService.accept_content(currID,newData);
            console.log('response', response.data);
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };


    //
    // const getSkeletonLoading = () => {
    //     return (
    //         <>
    //             <Typography variant='body2'>
    //                 Please wait and refrain from refreshing while we load your content...
    //             </Typography>
    //             {/* Your Skeleton components */}
    //         </>
    //     );
    // };

    const handleIgnore = () => {
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
            console.log('response.data', response.data);
        } catch (error) {
            setIsError(true);
        }
    };

    const handleClearSuggestionAndFaq = async () => {
        try {
            const response = await SuggestionService.delete_suggestion(currID);
            console.log('response.data', response.data);
        } catch (error) {
            setIsError(true);
        }
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
            console.log('notif id', notif_id);
            if (notif_id) {
                const response = await SuggestionService.create_content(currID, notif_id);
                console.log('response.data', response.data);
                setSuggestedContents(response.data.ai_response);
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
                </>
                )
    }

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
                    marginBottom: '2%',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <VerifiedIcon sx={{ color: '#fff', marginRight: '10px' }} />
                    <Typography
                        variant='body1'
                        sx={{
                            color: '#fff',
                            flex: 1,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        Suggested content for you!
                    </Typography>
                </div>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '4px',
                }}
            >
                <Button
                    variant='contained'
                    color='primary'
                    sx={{
                        backgroundColor: theme.palette.background.danger,
                        '&:hover': {
                            backgroundColor: '#761e1e',
                        },
                        textTransform: 'none',
                        paddingRight: '10px',
                        borderRadius: '20px',
                    }}
                    onClick={handleIgnore}
                    disable={isLoading}
                >
                    <CloseIcon sx={{ marginRight: '10px' }} />
                    Ignore
                </Button>
                <Button
                    variant='contained'
                    sx={{
                        ml: 1,
                        backgroundColor: '#1b5e20',
                        textTransform: 'none',
                        paddingRight: '10px',
                        borderRadius: '20px',
                    }}
                    onClick={handleAccept}
                    disabled={isLoading}
                >
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
                        textAlign: 'justify',
                    }}
                >
                    <Box sx={{ marginBottom: '2%' }}>
                        <PersonIcon
                            sx={{
                                color: theme.palette.background.neutral,
                                marginRight: '10px',
                                display: 'inline',
                            }}
                        />
                        <Typography
                            variant='h6'
                            sx={{
                                fontWeight: 'bold',
                                color: theme.palette.background.neutral,
                                display: 'inline',
                            }}
                        >
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
                        textAlign: 'justify',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '2%',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VerifiedIcon
                                sx={{
                                    color: theme.palette.primary.main,
                                    marginRight: '10px',
                                    display: 'inline',
                                }}
                            />
                            <Typography
                                variant='h6'
                                sx={{
                                    fontWeight: 'bold',
                                    color: theme.palette.primary.main,
                                    display: 'inline',
                                }}
                            >
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
                                        cursor: 'pointer',
                                    },
                                }}
                                className={clsx(isLoading && 'hidden')}
                                onClick={handleRegenerate}
                            />
                        </Tooltip>
                    </Box>
                    {/* Conditional rendering based on isLoading and suggestedContents */}
                    {isLoading || !suggestedContents ? (
                        getSkeletonLoading()
                    ) : (
                        <Editor ref={editorRef} contents={suggestedContents} />
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default SuggestContent;

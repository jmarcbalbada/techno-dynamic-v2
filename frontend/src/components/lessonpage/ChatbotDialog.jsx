import React, { useState, useRef, useEffect } from 'react';
import { LessonsService } from 'apis/LessonsService';
import { suggestedQuestions } from 'data/suggestedQuestions';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { BsRobot } from 'react-icons/bs';

const ChatbotDialog = (props) => {
  const { open, handleClose, lessonId, pageId } = props;
  const [isGettingResponse, setIsGettingResponse] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const robotName = 'TekBot';
  const [messages, setMessages] = useState([
    {
      message: `Hi, I am ${robotName}! How can I help you?`,
      sender: 'bot'
    }
  ]);

  // Ref to handle auto-scrolling
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        scrollToBottom();
      }, 0); // Ensure scrolling happens after rendering
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom(); // Scroll when messages are updated
  }, [messages]);

  const handleSend = async () => {
    setIsGettingResponse(true);
    const message = messageInput;
    setMessageInput(''); // Clear the message input immediately after getting its value

    // Add the user's message to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: message, sender: 'You' }
    ]);

    try {
      const response = await LessonsService.chatbot(lessonId, pageId, message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: response.data.response, sender: 'bot' }
      ]);
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsGettingResponse(false);
    }
  };

  return (
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth='md'>
        <DialogTitle sx={{ cursor: 'default' }}>Ask {robotName}!</DialogTitle>
        <DialogContent dividers>
          <Box display='flex' flexDirection='column' width={1}>
            {messages.map((message, index) => {
              const isBot = message.sender === 'bot';

              return (
                  <Paper
                      variant='outlined'
                      key={index}
                      sx={{
                        p: 1,
                        mb: 1,
                        maxWidth: '60%',
                        alignSelf: isBot ? 'flex-start' : 'flex-end',
                        overflowWrap: 'break-word',
                        bgcolor: isBot
                            ? 'rgba(240, 240, 240, 0.1)'
                            : 'rgba(27, 94, 32, 0.1)',
                        borderColor: isBot ? 'initial' : 'primary.main',
                        borderRadius: '15px',
                        borderBottomLeftRadius: isBot ? '0px' : '15px',
                        borderBottomRightRadius: isBot ? '15px' : '0px',
                        whiteSpace: 'pre-line'
                      }}>
                    {isBot && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BsRobot
                              size={24}
                              color='#4c80d4'
                              style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                          />
                          <Typography
                              variant='subtitle2'
                              color='primary'
                              sx={{ cursor: 'default' }}>
                            {robotName}
                          </Typography>
                        </Box>
                    )}
                    {!isBot && (
                        <Typography
                            align='right'
                            variant='subtitle2'
                            color='primary'
                            sx={{ cursor: 'default' }}>
                          {message.sender}
                        </Typography>
                    )}
                    <Typography variant='body2'>{message.message}</Typography>
                  </Paper>
              );
            })}

            {isGettingResponse && (
                <Typography
                    variant='body2'
                    sx={{
                      mb: 1
                    }}>
                  Getting response...
                </Typography>
            )}

            {/* Auto scroll target */}
            <div ref={messagesEndRef} />
          </Box>
          <Box>
            {messages.length === 1 && (
                <Box display='flex' flexWrap='wrap' gap={1} mt={2}>
                  {suggestedQuestions.map((question, index) => (
                      <Chip
                          key={index}
                          label={question.placeholder}
                          onClick={() => setMessageInput(question.question)}
                          variant='outlined'
                          color='primary'
                      />
                  ))}
                </Box>
            )}
          </Box>
          <Box display='flex' gap={1}>
            <TextField
                variant='standard'
                fullWidth
                label='Message'
                multiline
                maxRows={3}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (
                      e.key === 'Enter' &&
                      !e.shiftKey &&
                      !isGettingResponse &&
                      messageInput.trim()
                  ) {
                    e.preventDefault(); // Prevent newline from being added
                    handleSend();
                  }
                }}
            />
            <Button
                onClick={handleSend}
                variant='contained'
                color='primary'
                disabled={isGettingResponse || !messageInput.trim()}
                endIcon={<SendIcon />}>
              Send
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
  );
};

export default ChatbotDialog;

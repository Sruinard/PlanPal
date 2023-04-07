import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatInputProps {
    onSendMessage: (messageText: string) => void;
  }
  
  const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [messageText, setMessageText] = useState('');
  
    const handleSendMessage = () => {
      if (messageText.trim() !== '') {
        onSendMessage(messageText);
        setMessageText('');
      }
    };
  
    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        handleSendMessage();
      }
    };
  
    return (
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type your message here..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  };
  
  export default ChatInput;
  
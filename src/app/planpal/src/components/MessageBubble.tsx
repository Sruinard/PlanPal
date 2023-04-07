import React from 'react';
import { Avatar, Grid, Paper, Typography } from '@mui/material';
import Message from '../models/Message';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { text, isBot } = message;

  return (
    // if the message is from the bot, align it to the left
    // if the message is from the user, align it to the right
    <Grid container spacing={1} alignItems="center" justifyContent={isBot ? "right" : "left"}>
      <Grid item>
        {isBot ? (
          <Avatar alt="Bot" src="/bot.png" />
        ) : (
          <Avatar alt="You" src="/you.png" />
        )}
      </Grid>
      <Grid item>
        <Paper variant="outlined">
          <Typography variant="body1" component="p">
            {text}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MessageBubble;

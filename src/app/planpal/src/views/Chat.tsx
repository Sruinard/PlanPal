import React, { useState } from 'react';
import { Grid} from '@mui/material';
import MessageBubble from '../components/MessageBubble';
import Message  from '../models/Message'; // import the Message class
import ChatInput from '../components/ChatInput';
import "./Chat.css"


class IMessage {
    text: string;
    isBot: boolean;

    constructor(text: string, isBot: boolean) {
        this.text = text;
        this.isBot = isBot;
    }
  }

function ChatInterface(): JSX.Element {

  const [isbot, setIsBot] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (message: string) => {
    // Create a new instance of the Message class
    setIsBot(!isbot)
    const newMessage = new IMessage(message, isbot);
    // Add the new message to the messages array
    setMessages([...messages, newMessage]);
  };

  return (
    <Grid container direction="row" style={{ height: '100vh', overflow:"hidden", padding:"4rem"}}>
      <Grid container md={8} direction="column">
      <Grid item md={11} >
        {/* Render the messages */}
        {messages.map((message, index) => (
          // left align the messages from the user
          // right align the messages from the bot
          <MessageBubble
          
            key={index}
            message={message}
          />

        ))}
      </Grid>
      <Grid item md={1}>
        {/* Render the input field */}
        <ChatInput onSendMessage={handleSendMessage} />
      </Grid>
      </Grid>
    </Grid>
  );
}

export default ChatInterface;
// messageType can have only values 'text' or 'content'
import { Grid, Typography } from "@mui/material";

export interface IMessageBubble {
  message: string;
  isUser: boolean;
  messageType: "text" | "content";
}

// create a message bubble component to hold text or content
export const MessageBubble: React.FC<IMessageBubble> = ({
  message,
  isUser,
  messageType,
}) => {
  return (
    <Grid
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Grid
        style={{
          maxWidth: "80%",
          background: isUser ? "lightgreen" : "lightblue",
          padding: "0.5rem",
          borderRadius: "0.5rem",
        }}
      >
        {messageType === "text" ? (
          <Typography>{message}</Typography>
        ) : (
          <img src={message} alt="content" />
        )}
      </Grid>
    </Grid>
  );
};

import React from "react";
import { Card, Avatar } from "antd";

import { IMessage } from "./MessageHistory";

const { Meta } = Card;

interface ChatItemProps {
  message: IMessage;
  user: string;
  isMine: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({
  message,
  user: string,
  isMine,
}) => {
  const { content } = message;
  return (
    <Card
      style={{
        width: 300,
        alignSelf: isMine ? "flex-end" : "flex-start",
        backgroundColor: isMine ? "#7dbcea" : "#ffffff",
        margin: 10,
        flex: 1,
      }}
    >
      <Meta
        avatar={
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
        }
        description={content}
      />
    </Card>
  );
};

export default ChatItem;

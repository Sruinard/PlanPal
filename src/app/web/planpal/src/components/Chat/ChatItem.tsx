import React from "react";
import { Card, Avatar } from "antd";

// chat item
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
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
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
      style={{
        width: 300,
        alignSelf: isMine ? "flex-end" : "flex-start",
        backgroundColor: isMine ? "#7dbcea" : "#ffffff",
        margin: 10,
      }}
    >
      <Meta
        avatar={
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
        }
        description={content}
      />
    </Card>
    // <div>
    //   {!isMine ? (
    //     <Card
    //       actions={[
    //         <SettingOutlined key="setting" />,
    //         <EditOutlined key="edit" />,
    //         <EllipsisOutlined key="ellipsis" />,
    //       ]}
    //       style={{
    //         width: 300,
    //         alignSelf: isMine ? "flex-end" : "flex-start",
    //         backgroundColor: isMine ? "#7dbcea" : "#ffffff",
    //         margin: 10,
    //       }}
    //     >
    //       <Meta
    //         avatar={
    //           <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
    //         }
    //         description={content}
    //       />
    //     </Card>
    //   ) : (
    //     <Card
    //       style={{
    //         width: 300,
    //         alignSelf: "flex-end",
    //         backgroundColor: isMine ? "#7dbcea" : "#ffffff",
    //         maxHeight: 300,
    //         margin: 10,
    //       }}
    //     >
    //       <Meta
    //         avatar={
    //           <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
    //         }
    //         description={content}
    //       />
    //     </Card>
    //   )}
    // </div>
  );
};

export default ChatItem;

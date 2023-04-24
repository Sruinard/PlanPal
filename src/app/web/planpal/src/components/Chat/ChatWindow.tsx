import { useState } from "react";
import { List, Input, Button, Row, Col } from "antd";
import { IMessage, messageHistory } from "./MessageHistory";
// import sendIcon from antd
import { SendOutlined } from "@ant-design/icons";
// import styled from "styled-components";

const { TextArea } = Input;

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>(messageHistory);
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    const newMessage: IMessage = {
      content: messageInput,
      isUser: true,
    };
    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  return (
    <div>
      <List
        dataSource={messages}
        renderItem={(item: IMessage) => <List.Item>{item.content}</List.Item>}
        style={{
          overflow: "auto",
          flex: 10,
          maxHeight: "80vh",
        }}
      />
      <Row
        style={{
          flex: 2,
          justifyContent: "center",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <TextArea
          style={{ flex: 1 }}
          placeholder="textarea with clear icon"
          allowClear
          value={messageInput}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => setMessageInput(e.target.value)}
        />
        <Button
          onClick={handleSendMessage}
          style={{ display: "flex", alignItems: "center" }}
        >
          <SendOutlined />
        </Button>
      </Row>
    </div>
  );
};

export default ChatWindow;

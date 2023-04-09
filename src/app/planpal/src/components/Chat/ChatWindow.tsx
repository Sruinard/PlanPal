import { useState } from "react";
import { List, Input, Button, Row, Col } from "antd";
import { IMessage, messageHistory } from "./MessageHistory";

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
    <>
      <List
        dataSource={messages}
        renderItem={(item: IMessage) => <List.Item>{item.content}</List.Item>}
        style={{ height: "300px", overflow: "auto" }}
      />
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col
          span={16}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <TextArea
            style={{ minHeight: "100px" }}
            placeholder="textarea with clear icon"
            allowClear
            value={messageInput}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setMessageInput(e.target.value)}
          />
          <Button onClick={handleSendMessage} style={{ marginTop: "1rem" }}>
            Send
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ChatWindow;

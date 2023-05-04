import React, { useEffect } from "react";
import { Layout, Row } from "antd";
import TextControlled from "../components/Chat/TextControlled";
import VoiceControlled from "../components/Chat/VoiceControlled";
import { Segmented } from "antd";
import { AudioOutlined, CommentOutlined } from "@ant-design/icons";
import { IMessage } from "../components/Chat/MessageHistory";
import { Button } from "antd";
import ChatItem from "../components/Chat/ChatItem";

const { Header, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "#7dbcea",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  height: "calc(100vh - 64px - 128px)",
  backgroundColor: "#ffffff",
  overflow: "scroll",
  display: "flex",
  flexDirection: "column",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#ffffff",
  minHeight: 128,
  display: "flex",
  flexDirection: "column",
  borderWidth: 2,
  padding: 10,
  borderRadius: "50px 10px 0px 0px",
};

interface ChatScreenProps {
  accessToken: string;
  handleSignOut: () => void;
}

export default function ChatScreen(props: ChatScreenProps) {
  const [skipCallDuringMount, setSkipCallDuringMount] = React.useState(true);
  const [isVoiceControlled, setIsVoiceControlled] = React.useState(false);
  const [message, setMessage] = React.useState<IMessage>({} as IMessage);

  const [messages, setMessages] = React.useState<IMessage[]>([
    {
      isUser: false,
      content: "Hello, I'm PlanPal! How can I help you today?",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:7071/api/ping");
      const data = await res.json();
      console.log(data.message);
      setMessages([
        ...messages,
        message,
        {
          isUser: false,
          content: data.message,
        },
      ]);
    };
    if (skipCallDuringMount) {
      setSkipCallDuringMount(false);
    } else {
      fetchData();
    }
  }, [message, messages, skipCallDuringMount]);

  const onChangeSegmented = (key: string | number) => {
    console.log(key);
    if (key === "text") {
      setIsVoiceControlled(false);
    } else {
      setIsVoiceControlled(true);
    }
  };
  return (
    // <Space direction="vertical" style={{ height: "100vh", width: "100%" }}>

    <Layout>
      <Header style={headerStyle}>
        <Row>
          <h1>PlanPal</h1>
          <Button onClick={props.handleSignOut}>Sign out</Button>
        </Row>
      </Header>
      <Content style={contentStyle}>
        {messages.map((message, index) => (
          <ChatItem
            key={index}
            message={message}
            isMine={message.isUser}
            user={message.isUser ? "user" : "bot"}
          />
        ))}
      </Content>
      <Footer style={footerStyle}>
        <Row
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Segmented
            onChange={onChangeSegmented}
            options={[
              {
                label: "text",
                value: "text",
                icon: <CommentOutlined />,
              },
              {
                label: "speech",
                value: "speech",
                icon: <AudioOutlined />,
              },
            ]}
          />
        </Row>
        <Row style={{ flex: 4 }}>
          {isVoiceControlled ? (
            <VoiceControlled setMessage={setMessage} />
          ) : (
            <TextControlled setMessage={setMessage} />
          )}
        </Row>
      </Footer>
    </Layout>
    // </Space>
  );
}

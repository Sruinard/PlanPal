import React, { useEffect, useRef } from "react";
import { Layout, Row, Spin } from "antd";
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
  backgroundColor: "#ffffff",
  // borderBottom: "1px solid #9fa3a6",
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

interface UserInput {
  // Define the expected shape of the user input
  name: string;
  email: string;
  message: string;
  user_input: string;
  context: {};
}

const submitUserInput = async (userInput: UserInput, token: string) => {
  // Define the URL and authorization token
  // const url = `http://localhost:7071/api/kernel?user_input=${userInput.user_input}&token=${token}`;
  // const url = "http://127.0.0.1:7071/api/ping";
  const url = `${process.env.REACT_APP_FUNCTION_URI}/api/kernel`;

  // Define the request options, including the authorization header and body
  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userInput),
  };

  console.log("Option created");
  console.log(JSON.stringify(userInput));

  // Send the request and handle the response
  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const responseData = await response.json();
  // Do something with the response data, if needed
  console.log(responseData);
  return responseData;
};

export default function ChatScreen(props: ChatScreenProps) {
  // const [skipCallDuringMount, setSkipCallDuringMount] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const skipCallDuringMount = useRef(true);
  const [isVoiceControlled, setIsVoiceControlled] = React.useState(false);
  const [message, setMessage] = React.useState<IMessage>({
    content:
      "I've heard the app innovation team is having a hackathon and you are here to showcase what you can do... So tell me, what powers do you possess?",
    isUser: true,
  } as IMessage);

  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [context, setContext] = React.useState({
    context: {},
  });

  // create a post request with user_input in the body and add an authorization token as a header
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("====================");
      console.log(props.accessToken);
      const data = await submitUserInput(
        {
          name: "stef",
          email: "s",
          message: message.content,
          user_input: message.content,
          context: context.context,
        },
        props.accessToken
      );

      setContext({
        context: data.context,
      });
      console.log(data.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        message,
        {
          isUser: false,
          content: data.message,
        },
      ]);
      setLoading(false);
    };
    if (skipCallDuringMount.current) {
      skipCallDuringMount.current = false;
      return;
    } else {
      fetchData();
    }
  }, [message]); //eslint-disable-line

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onChangeSegmented = (key: string | number) => {
    console.log(key);
    if (key === "text") {
      setIsVoiceControlled(false);
    } else {
      setIsVoiceControlled(true);
    }
  };
  return (
    <Layout style={{ flex: 1 }}>
      <Header style={headerStyle}>
        <Row
          style={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <h1 style={{ flex: 1 }}>ClosedAI</h1>
          {process.env.REDIRECT_URL === "" && (
            <Button onClick={props.handleSignOut}>Sign out</Button>
          )}
        </Row>
      </Header>
      <Content style={contentStyle}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatItem
              key={index}
              message={message}
              isMine={message.isUser}
              user={message.isUser ? "user" : "bot"}
            />
          ))
        )}

        <div ref={bottomRef} />
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
  );
}

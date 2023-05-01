import React from "react";
import { Layout, Row, Col, Switch } from "antd";
import TextControlled from "../components/Chat/TextControlled";
import VoiceControlled from "../components/Chat/VoiceControlled";
import { Segmented } from "antd";
import { AudioOutlined, CommentOutlined } from "@ant-design/icons";

const { Header, Footer, Sider, Content } = Layout;
interface Styles {
  container: React.CSSProperties;
  header: React.CSSProperties;
  content: React.CSSProperties;
  footer: React.CSSProperties;
}

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
  overflow: "hidden",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#ffffff",
  minHeight: 128,
  display: "flex",
  flexDirection: "column",
  borderWidth: 2,
  padding: 10,
};

export default function ChatScreen() {
  const [voice, setVoice] = React.useState(false);
  const onChange = (key: string | string[]) => {
    console.log(key);
  };
  return (
    // <Space direction="vertical" style={{ height: "100vh", width: "100%" }}>

    <Layout>
      <Header style={headerStyle}>Header</Header>
      <Content style={contentStyle}>Content</Content>
      <Footer style={footerStyle}>
        <Row
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Segmented
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
          {voice ? <VoiceControlled /> : <TextControlled />}
        </Row>
      </Footer>
    </Layout>
    // </Space>
  );
}

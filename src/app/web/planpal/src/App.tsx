import React, { useState } from "react";
import "./App.css";
import ChatWindow from "./components/Chat/ChatWindow";
import PlannedSessions from "./components/Charging/Timeline";
import Login from "./components/Login/Login";
import { Row, Col, Layout, Menu, Typography, Modal } from "antd";

import { useAccount, useIsAuthenticated, useMsal } from "@azure/msal-react";
import type { MenuProps } from "antd";
const { Title } = Typography;
const { Header } = Layout;

interface IKeyConfig {
  graphToken?: string;
}

function App() {
  // on click of the login button, open a modal with the login form

  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [current, setCurrent] = useState("login");
  const onClick: MenuProps["onClick"] = (e) => {
    // if e.key == 1, then open modal
    if (e.key === "1") {
      showModal();
    } else if (e.key === "2") {
      instance.logoutRedirect();
    }
    setCurrent(e.key);
  };

  return (
    <>
      <Header
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Title
          style={{
            flex: 1,
            color: "white",
            display: "flex",
            alignItems: "center",
            marginRight: 50,
          }}
        >
          PLANPAL
        </Title>

        <Menu
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            justifyContent: "flex-end",
          }}
          theme="dark"
          mode="horizontal"
          onClick={onClick}
          defaultSelectedKeys={[]}
          items={[
            {
              key: "1",
              label: "login",
            },
            {
              key: "2",
              label: "logout",
            },
          ]}
        />
      </Header>

      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Login />
      </Modal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 1fr)",
          gridTemplateAreas: `"content content content content content content right right right"`,
        }}
      >
        <div
          style={{
            gridArea: "content",
            margin: "0 20px",
          }}
        >
          <h2>Chat</h2>
          <ChatWindow />
        </div>
        <div
          style={{
            gridArea: "right",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FAF9F8",
            padding: "20px",
          }}
        >
          <Col span={24} style={{ maxHeight: "calc(100vh - 240px)" }}>
            <h2>Planned Sessions</h2>
            <Row style={{ height: "50%", overflow: "scroll" }}>
              <PlannedSessions />
            </Row>
            <h2>Timeline Schedule</h2>
            <Row style={{ height: "50%", overflow: "scroll" }}>
              <PlannedSessions />
            </Row>
          </Col>
        </div>
      </div>
    </>
  );
}

export default App;

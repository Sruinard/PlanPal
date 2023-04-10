import React from "react";
import "./App.css";
import ChatWindow from "./components/Chat/ChatWindow";
import PlannedSessions from "./components/Charging/Timeline";
import { Row, Col } from "antd";

function App() {
  return (
    <>
      <div id="header">
        <h1>PlanPal</h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 1fr)",
          gridTemplateAreas: `"content content content content content content right right right"`,
        }}
      >
        <div style={{ gridArea: "content", margin: "0 20px" }}>
          <ChatWindow />
        </div>
        <div
          style={{
            gridArea: "right",
            display: "flex",
            flexDirection: "column",
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

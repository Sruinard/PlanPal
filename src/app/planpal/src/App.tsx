import React from "react";
import "./App.css";
import ChatWindow from "./components/Chat/ChatWindow";
import { Grid } from "@mui/material";

function App() {
  return (
    <Grid
      id="container"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <Grid id="header">
        <h1>PlanPal</h1>
      </Grid>

      <Grid
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          flex: 1,
          alignContent: "start",
          justifyContent: "space-between",
        }}
      >
        <Grid id="content">
          <Grid id="main">
            <ChatWindow />
          </Grid>
        </Grid>
        <Grid id="info"></Grid>
      </Grid>
    </Grid>
  );
}

export default App;

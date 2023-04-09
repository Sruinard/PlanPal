import React from "react";
import "./App.css";
import ChatWindow from "./components/Chat/ChatWindow";
import { Grid } from "@mui/material";

function App() {
  return (
    <Grid
      id="container"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Grid id="header">
        <h1>PlanPal</h1>
      </Grid>

      <Grid
        style={{
          display: "flex",
          gridTemplateColumns: "10% 80% 10%",
          gridTemplateAreas: "left content right",
          gap: 10,
          flex: 1,
        }}
      >
        <Grid style={{ gridArea: "left" }}>// content of the left column</Grid>
        <Grid
          style={{
            gridArea: "content",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <ChatWindow />
        </Grid>
        <Grid style={{ gridArea: "right" }}>
          // content of the right column
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;

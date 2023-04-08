import React from "react";

import { Grid } from "@mui/material";

function ChatWindow() {
  return (
    <Grid
      style={{
        paddingTop: 20,
        gap: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        height: "100%",
      }}
    >
      {/* Chat content */}
      <Grid
        style={{
          position: "relative",
          paddingBottom: "1rem",
          display: "grid",
          gridTemplateColumns: "minmax(300px, 800px)",
          gridTemplateRows: "auto 1fr auto",
          gridTemplateAreas: "'menu' 'content' 'footer'",
          justifyContent: "center",
          padding: "0 1rem",
          height: "100%",
        }}
      >
        <Grid
          style={{
            gridArea: "content",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "1rem 0",
            background: "blue",
          }}
        >
          <h1>Chat Content</h1>
        </Grid>

        {/* FOOTER */}
        <Grid
          style={{
            gridArea: "footer",
            background: "green",
          }}
        >
          <h1>Chat Footer</h1>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChatWindow;

import { PublicClientApplication, Configuration } from "@azure/msal-browser";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Button } from "antd";
import React, { useEffect, useState } from "react";

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_GRAPH_CLIENT_ID as string,
    // authority:
    //   "https://login.microsoftonline.com/ff010600-2503-4162-a7cf-094c633adfce",
    redirectUri: "http://localhost:3000",
  },
};

const scopes = process.env.REACT_APP_GRAPH_SCOPES!.split(",");

interface IHomeScreenProps {
  isAuthenticated: boolean;
  accessToken: string | null;
  handleSignIn(): void;
  handleSignOut(): void;
}

const HomeScreen = (props: IHomeScreenProps) => {
  return (
    <div>
      <h1>
        {props.isAuthenticated ? "You are signed in" : "You are signed out"}
      </h1>
      {props.isAuthenticated ? (
        <div>
          <p>Access Token: {props.accessToken}</p>
          <button onClick={props.handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={props.handleSignIn}>Sign In</button>
      )}
    </div>
  );
};

export default HomeScreen;

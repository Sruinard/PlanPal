import { PublicClientApplication, Configuration } from "@azure/msal-browser";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_GRAPH_CLIENT_ID as string,
    redirectUri: "http://localhost:3000",
  },
};

const scopes = process.env.REACT_APP_GRAPH_SCOPES!.split(",");

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated && !accessToken) {
      instance
        .acquireTokenSilent({
          scopes,
          account: accounts[0],
        })
        .then((response) => {
          setAccessToken(response.accessToken);
        })
        .catch((error) => {
          if (error.name == "InteractionRequiredAuthError") {
            instance
              .acquireTokenPopup({
                scopes,
              })
              .then((response) => {
                setAccessToken(response.accessToken);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    }
  }, [isAuthenticated, accessToken, accounts, instance]);

  const handleSignIn = () => {
    instance.loginPopup({
      scopes,
    });
  };

  const handleSignOut = () => {
    instance.logout();
    setAccessToken(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {isAuthenticated ? (
        <ChatScreen />
      ) : (
        <HomeScreen
          isAuthenticated={isAuthenticated}
          accessToken={accessToken}
          handleSignIn={handleSignIn}
          handleSignOut={handleSignOut}
        />
      )}
    </div>
  );
};

const AppWithProvider = () => {
  const msalInstance = new PublicClientApplication(msalConfig);
  return (
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  );
};

export default AppWithProvider;

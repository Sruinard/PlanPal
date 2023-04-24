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

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [events, setEvents] = useState<any[]>([]);

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

  const getCalendarEvents = () => {
    fetch("https://graph.microsoft.com/v1.0/me/events", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setEvents(data);
      });
  };

  return (
    <div>
      <h1>{isAuthenticated ? "You are signed in" : "You are signed out"}</h1>
      {isAuthenticated ? (
        <div>
          <p>Access Token: {accessToken}</p>
          <button onClick={handleSignOut}>Sign Out</button>
          <Button onClick={getCalendarEvents}>Retrieve events</Button>
          {events ? <div></div> : <div>no events</div>}
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
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

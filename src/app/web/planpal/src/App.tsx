import {
  PublicClientApplication,
  Configuration,
  InteractionType,
} from "@azure/msal-browser";
import {
  MsalProvider,
  useMsal,
  useIsAuthenticated,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  MsalAuthenticationTemplate,
} from "@azure/msal-react";
import { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_GRAPH_CLIENT_ID as string,
    redirectUri: process.env.REDIRECT_URL as string,
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
          console.log(response.accessToken);
          setAccessToken(response.accessToken);
        })
        .catch((error) => {
          if (error.name === "InteractionRequiredAuthError") {
            instance
              .acquireTokenPopup({
                scopes,
              })
              .then((response) => {
                console.log(response.accessToken);
                setAccessToken(response.accessToken);
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    }
  }, [isAuthenticated, accessToken, accounts, instance]);

  const loginRequest = {
    scopes: ["Calendars.ReadWrite"],
  };

  const handleSignIn = () => {
    instance
      .loginRedirect(loginRequest)
      .then((response) => {
        console.log("Signed in with redirect");
      })
      .catch((e) => {
        console.log(e);
      });

    // instance.loginPopup({
    //   scopes,
    // });
  };

  const handleSignOut = () => {
    instance.logout();
    setAccessToken(null);
  };

  return (
    <div
      style={{
        display: "flex",
        maxHeight: "-webkit-fill-available",
      }}
    >
      <UnauthenticatedTemplate>
        <HomeScreen
          isAuthenticated={isAuthenticated}
          accessToken={accessToken}
          handleSignIn={handleSignIn}
          handleSignOut={handleSignOut}
        />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <ChatScreen
          accessToken={accessToken as string}
          handleSignOut={handleSignOut}
        />
      </AuthenticatedTemplate>
    </div>
  );
};

const AppWithProvider = () => {
  const msalInstance = new PublicClientApplication(msalConfig);
  return (
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        <App />
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
};

export default AppWithProvider;

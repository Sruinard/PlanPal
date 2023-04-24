// Copyright (c) Microsoft. All rights reserved.

import { useMsal } from "@azure/msal-react";
import { Typography, Button, Image } from "antd";
import { FC } from "react";
import signInLogo from "../../../src/ms-symbol.svg";
import { useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";

const { Title, Paragraph } = Typography;

const Login: FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();
  const loginRequest = {
    scopes: (process.env.REACT_APP_GRAPH_SCOPES as string).split(","),
  };

  return (
    <div
      style={{
        padding: 40,
        gap: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Title>Login with your Microsoft Account</Title>
      <Paragraph>
        Use your Microsoft Account to access your personal graph information and
        Microsoft services for this sample.
      </Paragraph>
      <Paragraph>
        Don't have an account? Create one for free at{" "}
        <a
          href="https://account.microsoft.com/"
          target="_blank"
          rel="noreferrer"
        >
          https://account.microsoft.com/
        </a>
      </Paragraph>

      <Button
        style={{ padding: 0 }}
        onClick={() => {
          if (inProgress === InteractionStatus.None && !isAuthenticated) {
            instance.loginRedirect(loginRequest);
          }
        }}
      >
        <Image src={signInLogo} />
      </Button>
    </div>
  );
};

export default Login;

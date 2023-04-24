// Copyright (c) Microsoft. All rights reserved.

import { useMsal } from "@azure/msal-react";
import { Typography, Button } from "antd";
import { FC } from "react";

const Logout: FC = () => {
  const { instance } = useMsal();

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
      <Button
        style={{ padding: 0 }}
        onClick={() => {
          instance.logoutRedirect();
        }}
      ></Button>
    </div>
  );
};

export default Logout;

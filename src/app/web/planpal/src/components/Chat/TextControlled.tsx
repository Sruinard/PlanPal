import React from "react";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Button, Radio, Space, Divider } from "antd";

const { TextArea } = Input;

const TextControlled = () => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ flex: 1 }}>
        {/* <Button type="primary" icon={<SendOutlined />} /> */}
      </div>
      <div style={{ flex: 5 }}>
        <TextArea autoSize={{ minRows: 1, maxRows: 4 }} />
      </div>
      <div style={{ flex: 1 }}>
        <Button type="primary" icon={<SendOutlined />} />
      </div>
    </div>
  );
};

export default TextControlled;

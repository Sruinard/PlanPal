import React from "react";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Dispatch, SetStateAction } from "react";
import { IMessage } from "./MessageHistory";

interface ITextControlledProps {
  // setMessage(value: string): void;
  setMessage: Dispatch<SetStateAction<IMessage>>;
}

const { TextArea } = Input;

const TextControlled: React.FC<ITextControlledProps> = (props) => {
  const [textValue, setTextValue] = React.useState("");

  const onChange = (e: any) => {
    setTextValue(e.target.value);
  };

  const handleInput = () => {
    setTextValue("");
    props.setMessage({
      content: textValue,
      isUser: true,
    });
  };

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
        <TextArea
          autoSize={{ minRows: 1, maxRows: 3 }}
          onChange={onChange}
          value={textValue}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Button type="primary" icon={<SendOutlined />} onClick={handleInput} />
      </div>
    </div>
  );
};

export default TextControlled;

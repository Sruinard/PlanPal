import React, { useState, useEffect } from "react";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { Button } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Dispatch, SetStateAction } from "react";
import { IMessage } from "./MessageHistory";

interface IVoiceControlledProps {
  // setMessage(value: string): void;
  setMessage: Dispatch<SetStateAction<IMessage>>;
}

const getTokenOrRefresh = async () => {
  // fetch GET http://localhost:7071/api/speech
  const tokenRes = await fetch("http://localhost:7071/api/speech");
  const tokenObj = await tokenRes.json();

  let returnObject = {
    authToken: tokenObj.access_token,
    region: tokenObj.region,
    error: tokenObj.error,
  };

  return returnObject;
};

const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

const VoiceControlled: React.FC<IVoiceControlledProps> = (props) => {
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const tokenRes = await getTokenOrRefresh();
      if (tokenRes.authToken === null) {
        props.setMessage({} as IMessage);
      }
    };
    fetchData();
  }, []);

  const sttFromMic = async () => {
    setIsCapturing(true);
    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    recognizer.recognizeOnceAsync((result: any) => {
      let displayText;
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = result.text;
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }

      props.setMessage({
        content: displayText,
        isUser: true,
      });
      setIsCapturing(false);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div style={{ flex: 1 }}>
        {isCapturing ? (
          <Spin />
        ) : (
          <Button
            onClick={sttFromMic}
            disabled={isCapturing}
            shape="circle"
            size="large"
            icon={<AudioOutlined />}
          ></Button>
        )}
      </div>
    </div>
  );
};

export default VoiceControlled;

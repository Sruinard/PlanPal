import React, { useState, useEffect } from "react";
import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { Button } from "antd";

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

const VoiceControlled: React.FC = () => {
  const [displayText, setDisplayText] = useState<string>(
    "INITIALIZED: ready to test speech..."
  );

  useEffect(() => {
    const fetchData = async () => {
      const tokenRes = await getTokenOrRefresh();
      if (tokenRes.authToken === null) {
        setDisplayText("FATAL_ERROR: " + tokenRes.error);
      }
    };
    fetchData();
  }, []);

  const sttFromMic = async () => {
    const tokenObj = await getTokenOrRefresh();
    console.log(tokenObj);
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

    setDisplayText("speak into your microphone...");

    recognizer.recognizeOnceAsync((result: any) => {
      let displayText;
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${result.text}`;
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }

      setDisplayText(displayText);
    });
  };

  const fileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const audioFile = event.target.files![0];
    console.log(audioFile);
    const fileInfo = audioFile.name + ` size=${audioFile.size} bytes `;

    setDisplayText(fileInfo);

    const tokenObj = await getTokenOrRefresh();
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      tokenObj.authToken,
      tokenObj.region
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = speechsdk.AudioConfig.fromWavFileInput(audioFile);
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    recognizer.recognizeOnceAsync((result: any) => {
      let displayText;
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${result.text}`;
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }

      setDisplayText(fileInfo + displayText);
    });
  };
  return (
    <div>
      <Button onClick={sttFromMic}>Record</Button>
      <input
        type="file"
        id="audio-file"
        onChange={(e) => fileChange(e)}
        style={{ display: "none" }}
      />
      <h1>{displayText}</h1>
    </div>
  );
};

export default VoiceControlled;

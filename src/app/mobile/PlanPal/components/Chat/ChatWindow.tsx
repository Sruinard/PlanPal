import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import TextBubble from "./TextBubble";
import { Data, ChatModel } from "./ChatModel";
import { TextArea, Button, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const ChatWindow: React.FC = () => {
  const [textAreaValue, setTextAreaValue] = useState("Value Controlled");
  return (
    <View style={styles.container}>
      <View style={{ ...styles.chatWindow }}>
        <ScrollView>
          {Data.map((item: ChatModel) => {
            return (
              <TextBubble
                key={item.id}
                text={item.text}
                additionalStyles={{
                  alignItems: item.user._id === 1 ? "flex-end" : "flex-start",
                }}
              />
            );
          })}
        </ScrollView>
      </View>
      <View style={{ ...styles.userInput }}>
        <TextArea
          value={textAreaValue}
          onChangeText={(text) => setTextAreaValue(text)} // for android and ios
          w="75%"
          maxW="300"
          autoCompleteType={"off"}
          backgroundColor={"#F2F2F2"}
        />
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flex: 1,
            paddingLeft: 10,
          }}
        >
          <Button
            style={{ flex: 1 }}
            endIcon={<Icon as={Ionicons} name="send" />}
          />
          <Button
            style={{ flex: 1 }}
            endIcon={<Icon as={Ionicons} name="mic" />}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
  chatWindow: {
    flex: 10,
    display: "flex",
  },
  userInput: {
    display: "flex",
    height: 100,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default ChatWindow;

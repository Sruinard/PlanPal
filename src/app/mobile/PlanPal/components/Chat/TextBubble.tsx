import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TextBubbleProps {
  text: string;
  additionalStyles?: object;
  image?: string;
  sound?: string;
  video?: string;
}

const TextBubble: React.FC<TextBubbleProps> = ({ text, additionalStyles }) => {
  return (
    <View style={{ ...styles.container, ...additionalStyles }}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    margin: 10,
  },
  bubble: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: "80%",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default TextBubble;

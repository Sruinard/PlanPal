import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import ChatWindow from "./components/Chat/ChatWindow";
import { NativeBaseProvider } from "native-base";

const App = () => {
  return (
    <NativeBaseProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.content}>
            <ChatWindow />
          </View>
        </View>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default App;

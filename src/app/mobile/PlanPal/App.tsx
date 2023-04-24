import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";

export default function App() {
  const handlePress = () => {
    console.log("Hello");
  };

  return (
    <View style={styles.container}>
      <Text> PlanPal </Text>
      <Button onPress={handlePress} title="Hello"></Button>
      <Text>Hello world</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import React from "react";
import { View, StyleSheet, SafeAreaView, Button, Text } from "react-native";
import ChatWindow from "./components/Chat/ChatWindow";
import { NativeBaseProvider } from "native-base";

import * as AuthSession from "expo-auth-session";
import { openAuthSession } from "azure-ad-graph-expo";

import AzureAuth from "react-native-azure-auth";

let AZURE_CLIENT_ID = "c0a957e2-aa58-4cf1-9b54-50e55b69e7cf";
let AZURE_TENANT_ID = "ff010600-2503-4162-a7cf-094c633adfce";
let AZURE_CLIENT_SECRET = "WPy8Q~aId9p3OPI9n~noXa5hGU37lVmsbJX7oda2";
let AZURE_DOMAIN_HINT = "login.microsoftonline.com";

// let kRedirectUri = "msauth.com.planpal.app://auth";
// let kAuthority = "https://login.microsoftonline.com/common";
// let kGraphEndpoint = "https://graph.microsoft.com/";

// let bundleId = "com.planpal.app";

// const scopes = ["user.read"];

const azureAdAppProps = {
  clientId: AZURE_CLIENT_ID,
  tenantId: AZURE_TENANT_ID,
  scope: "user.read",
  redirectUrl: AuthSession.makeRedirectUri(),
  returnUrl: null, // If left as 'null', redirectUrl will be used instead
  clientSecret: AZURE_CLIENT_SECRET,
  domainHint: AZURE_DOMAIN_HINT,
  prompt: "login",
};

const App = () => {
  let [state, setState] = React.useState({
    result: null,
  });

  const _handlePressAsync = async () => {
    let result = await openAuthSession(azureAdAppProps);
    setState({ result });
  };

  return (
    <NativeBaseProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Button title="Login" onPress={_handlePressAsync} />
            {state.result ? (
              <Text>{JSON.stringify(state.result)}</Text>
            ) : (
              <Text>Nothing to see here.</Text>
            )}
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

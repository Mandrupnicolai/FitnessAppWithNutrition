import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { theme } from "./src/theme";

export default function App() {
  return (
    <NavigationContainer theme={theme.nav}>
      <RootNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}


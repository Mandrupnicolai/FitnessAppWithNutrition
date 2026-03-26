import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainScreen } from "../screens/MainScreen";
import { TrainingNavigator } from "./TrainingNavigator";
import { ProfileScreen } from "../screens/ProfileScreen";

export type MainTabParamList = {
  Home: undefined;
  Training: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="Training" component={TrainingNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

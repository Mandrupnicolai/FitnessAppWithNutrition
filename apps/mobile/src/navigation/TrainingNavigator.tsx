import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TrainingDaysScreen } from "../screens/TrainingDaysScreen";
import { TrainingDayScreen } from "../screens/TrainingDayScreen";
import { LogWorkoutScreen } from "../screens/LogWorkoutScreen";
import { ExerciseHistoryScreen } from "../screens/ExerciseHistoryScreen";

export type TrainingStackParamList = {
  TrainingDays: undefined;
  TrainingDay: { id: string };
  LogWorkout: { trainingDayId: string };
  ExerciseHistory: { name: string };
};

const Stack = createNativeStackNavigator<TrainingStackParamList>();

export function TrainingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrainingDays" component={TrainingDaysScreen} />
      <Stack.Screen name="TrainingDay" component={TrainingDayScreen} />
      <Stack.Screen name="LogWorkout" component={LogWorkoutScreen} />
      <Stack.Screen name="ExerciseHistory" component={ExerciseHistoryScreen} />
    </Stack.Navigator>
  );
}


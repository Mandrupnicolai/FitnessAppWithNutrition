import React from "react";
import { View, Text, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        backgroundColor: colors.bg,
        justifyContent: "center"
      }}
    >
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: "700" }}>
        Fitness
      </Text>
      <Text style={{ color: colors.muted, marginTop: 8, fontSize: 16 }}>
        Track workouts, calories, and progress across cutting, bulking, and
        equilibrium.
      </Text>
      <Pressable
        onPress={() => navigation.navigate("Login")}
        style={{
          marginTop: 24,
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 12
        }}
      >
        <Text
          style={{
            color: "#051018",
            fontWeight: "700",
            textAlign: "center"
          }}
        >
          Get started
        </Text>
      </Pressable>
    </View>
  );
}


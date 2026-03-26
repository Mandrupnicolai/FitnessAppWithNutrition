import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { apiFetch } from "../api/client";
import { colors } from "../theme";
import type { TrainingStackParamList } from "../navigation/TrainingNavigator";

type TrainingDay = {
  _id: string;
  name: string;
  exercises: Array<{ name: string; sets: number; reps: number; weightKg?: number }>;
};

type Props = NativeStackScreenProps<TrainingStackParamList, "TrainingDays">;

export function TrainingDaysScreen({ navigation }: Props) {
  const [days, setDays] = useState<TrainingDay[]>([]);
  const [newName, setNewName] = useState("");

  async function refresh() {
    const res = await apiFetch<{ trainingDays: TrainingDay[] }>("/training-days");
    setDays(res.trainingDays);
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  async function createDay() {
    if (!newName.trim()) return;
    await apiFetch("/training-days", {
      method: "POST",
      json: { name: newName.trim(), exercises: [] }
    });
    setNewName("");
    refresh().catch(() => undefined);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "900" }}>Training days</Text>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="e.g., Leg Day 1"
          placeholderTextColor={colors.muted}
          style={{ flex: 1, color: colors.text, padding: 12, borderRadius: 12, backgroundColor: colors.card }}
        />
        <Pressable
          onPress={createDay}
          style={{ paddingHorizontal: 14, justifyContent: "center", borderRadius: 12, backgroundColor: colors.primary }}
        >
          <Text style={{ color: "#051018", fontWeight: "900" }}>Add</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 16, gap: 10 }}>
        {days.map((d) => (
          <Pressable
            key={d._id}
            onPress={() => navigation.navigate("TrainingDay", { id: d._id })}
            style={{
              padding: 16,
              borderRadius: 16,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>
              {d.name}
            </Text>
            <Text style={{ color: colors.muted, marginTop: 6 }}>
              {d.exercises.length} exercises
            </Text>
          </Pressable>
        ))}
        {days.length === 0 ? (
          <Text style={{ color: colors.muted, marginTop: 10 }}>
            No training days yet.
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

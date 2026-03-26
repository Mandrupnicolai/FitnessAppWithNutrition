import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { apiFetch } from "../api/client";
import { colors } from "../theme";
import type { TrainingStackParamList } from "../navigation/TrainingNavigator";

type Exercise = { name: string; sets: number; reps: number; weightKg?: number; notes?: string };
type TrainingDay = { _id: string; name: string; exercises: Exercise[] };

type Props = NativeStackScreenProps<TrainingStackParamList, "TrainingDay">;

export function TrainingDayScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [day, setDay] = useState<TrainingDay | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newExercise, setNewExercise] = useState({ name: "", sets: "3", reps: "8", weightKg: "" });

  async function refresh() {
    const res = await apiFetch<{ trainingDay: TrainingDay }>(`/training-days/${id}`);
    setDay(res.trainingDay);
  }

  useEffect(() => {
    refresh().catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  const canStart = useMemo(() => (day?.exercises?.length ?? 0) > 0, [day]);

  async function addExercise() {
    if (!day) return;
    if (!newExercise.name.trim()) return;
    const updated: TrainingDay = {
      ...day,
      exercises: [
        ...day.exercises,
        {
          name: newExercise.name.trim(),
          sets: Number(newExercise.sets) || 3,
          reps: Number(newExercise.reps) || 8,
          weightKg: newExercise.weightKg ? Number(newExercise.weightKg) : undefined
        }
      ]
    };

    setError(null);
    setDay(updated);
    setNewExercise({ name: "", sets: "3", reps: "8", weightKg: "" });
    try {
      await apiFetch(`/training-days/${id}`, {
        method: "PUT",
        json: { name: updated.name, exercises: updated.exercises }
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
      refresh().catch(() => undefined);
    }
  }

  async function removeExercise(index: number) {
    if (!day) return;
    const updatedExercises = day.exercises.filter((_e, i) => i !== index);
    setDay({ ...day, exercises: updatedExercises });
    await apiFetch(`/training-days/${id}`, {
      method: "PUT",
      json: { name: day.name, exercises: updatedExercises }
    });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 24 }}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.muted }}>← Back</Text>
      </Pressable>

      <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 10 }}>
        {day?.name ?? "Training day"}
      </Text>

      {error ? <Text style={{ color: colors.danger, marginTop: 10 }}>{error}</Text> : null}

      <View style={{ marginTop: 16, padding: 16, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ color: colors.text, fontWeight: "900" }}>Add exercise</Text>
        <TextInput
          value={newExercise.name}
          onChangeText={(v) => setNewExercise((s) => ({ ...s, name: v }))}
          placeholder="Exercise name (e.g., Squat)"
          placeholderTextColor={colors.muted}
          style={{ marginTop: 10, color: colors.text, padding: 12, borderRadius: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }}
        />
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <TextInput
            value={newExercise.sets}
            onChangeText={(v) => setNewExercise((s) => ({ ...s, sets: v }))}
            keyboardType="numeric"
            placeholder="Sets"
            placeholderTextColor={colors.muted}
            style={{ flex: 1, color: colors.text, padding: 12, borderRadius: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }}
          />
          <TextInput
            value={newExercise.reps}
            onChangeText={(v) => setNewExercise((s) => ({ ...s, reps: v }))}
            keyboardType="numeric"
            placeholder="Reps"
            placeholderTextColor={colors.muted}
            style={{ flex: 1, color: colors.text, padding: 12, borderRadius: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }}
          />
          <TextInput
            value={newExercise.weightKg}
            onChangeText={(v) => setNewExercise((s) => ({ ...s, weightKg: v }))}
            keyboardType="numeric"
            placeholder="kg"
            placeholderTextColor={colors.muted}
            style={{ flex: 1, color: colors.text, padding: 12, borderRadius: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }}
          />
        </View>
        <Pressable onPress={addExercise} style={{ marginTop: 12, backgroundColor: colors.primary, padding: 12, borderRadius: 12 }}>
          <Text style={{ color: "#051018", fontWeight: "900", textAlign: "center" }}>Add</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: colors.muted, marginBottom: 8 }}>Exercises</Text>
        {day?.exercises?.length ? (
          <View style={{ gap: 10 }}>
            {day.exercises.map((e, idx) => (
              <View key={`${e.name}-${idx}`} style={{ padding: 14, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ color: colors.text, fontWeight: "900" }}>{e.name}</Text>
                  <Pressable onPress={() => removeExercise(idx)}>
                    <Text style={{ color: colors.danger, fontWeight: "900" }}>Remove</Text>
                  </Pressable>
                </View>
                <Text style={{ color: colors.muted, marginTop: 6 }}>
                  {e.sets} x {e.reps} {typeof e.weightKg === "number" ? `@ ${e.weightKg}kg` : ""}
                </Text>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <Pressable
                    onPress={() => navigation.navigate("ExerciseHistory", { name: e.name })}
                    style={{ flex: 1, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg }}
                  >
                    <Text style={{ color: colors.text, textAlign: "center", fontWeight: "800" }}>History</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ color: colors.muted }}>No exercises yet.</Text>
        )}
      </View>

      <Pressable
        disabled={!canStart}
        onPress={() => navigation.navigate("LogWorkout", { trainingDayId: id })}
        style={{
          marginTop: 18,
          backgroundColor: canStart ? colors.primary : colors.border,
          padding: 14,
          borderRadius: 12
        }}
      >
        <Text style={{ color: canStart ? "#051018" : colors.muted, fontWeight: "900", textAlign: "center" }}>
          Start workout
        </Text>
      </Pressable>
    </ScrollView>
  );
}


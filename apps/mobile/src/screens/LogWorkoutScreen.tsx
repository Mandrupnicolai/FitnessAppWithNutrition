import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { apiFetch } from "../api/client";
import { colors } from "../theme";
import type { TrainingStackParamList } from "../navigation/TrainingNavigator";

type ExerciseTemplate = { name: string; sets: number; reps: number; weightKg?: number };
type TrainingDay = { _id: string; name: string; exercises: ExerciseTemplate[] };

type SetEntry = { reps: string; weightKg: string };
type ExerciseEntry = { name: string; sets: SetEntry[] };

type Props = NativeStackScreenProps<TrainingStackParamList, "LogWorkout">;

export function LogWorkoutScreen({ route, navigation }: Props) {
  const { trainingDayId } = route.params;
  const [day, setDay] = useState<TrainingDay | null>(null);
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await apiFetch<{ trainingDay: TrainingDay }>(`/training-days/${trainingDayId}`);
      setDay(res.trainingDay);
      setEntries(
        res.trainingDay.exercises.map((e) => ({
          name: e.name,
          sets: Array.from({ length: e.sets }, () => ({
            reps: String(e.reps),
            weightKg: typeof e.weightKg === "number" ? String(e.weightKg) : ""
          }))
        }))
      );
    })().catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [trainingDayId]);

  const canSave = useMemo(() => entries.length > 0, [entries]);

  function updateSet(exIdx: number, setIdx: number, patch: Partial<SetEntry>) {
    setEntries((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s, j) => (j !== setIdx ? s : { ...s, ...patch }))
            }
      )
    );
  }

  async function save() {
    setError(null);
    try {
      await apiFetch("/workouts", {
        method: "POST",
        json: {
          trainingDayId,
          exercises: entries.map((ex) => ({
            name: ex.name,
            sets: ex.sets.map((s) => ({ reps: Number(s.reps) || 0, weightKg: Number(s.weightKg) || 0 }))
          }))
        }
      });
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 24 }}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.muted }}>← Back</Text>
      </Pressable>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 10 }}>
        {day ? `Log: ${day.name}` : "Log workout"}
      </Text>
      {error ? <Text style={{ color: colors.danger, marginTop: 10 }}>{error}</Text> : null}

      <View style={{ marginTop: 16, gap: 12 }}>
        {entries.map((ex, exIdx) => (
          <View key={ex.name} style={{ padding: 14, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>{ex.name}</Text>
            <View style={{ marginTop: 10, gap: 8 }}>
              {ex.sets.map((s, setIdx) => (
                <View key={setIdx} style={{ flexDirection: "row", gap: 10 }}>
                  <TextInput
                    value={s.reps}
                    onChangeText={(v) => updateSet(exIdx, setIdx, { reps: v })}
                    keyboardType="numeric"
                    placeholder="reps"
                    placeholderTextColor={colors.muted}
                    style={{ flex: 1, color: colors.text, padding: 10, borderRadius: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }}
                  />
                  <TextInput
                    value={s.weightKg}
                    onChangeText={(v) => updateSet(exIdx, setIdx, { weightKg: v })}
                    keyboardType="numeric"
                    placeholder="kg"
                    placeholderTextColor={colors.muted}
                    style={{ flex: 1, color: colors.text, padding: 10, borderRadius: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <Pressable
        disabled={!canSave}
        onPress={save}
        style={{ marginTop: 18, backgroundColor: canSave ? colors.primary : colors.border, padding: 14, borderRadius: 12 }}
      >
        <Text style={{ color: canSave ? "#051018" : colors.muted, fontWeight: "900", textAlign: "center" }}>
          Save workout
        </Text>
      </Pressable>
    </ScrollView>
  );
}


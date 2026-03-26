import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TrainingStackParamList } from "../navigation/TrainingNavigator";
import { apiFetch } from "../api/client";
import { colors } from "../theme";
import { ProgressChart } from "../components/ProgressChart";

type HistoryItem = { performedAt: string; topWeightKg: number; sets: Array<{ reps: number; weightKg: number }> };
type SeriesPoint = { date: string; value: number };

type Props = NativeStackScreenProps<TrainingStackParamList, "ExerciseHistory">;

export function ExerciseHistoryScreen({ route, navigation }: Props) {
  const name = route.params.name;
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await apiFetch<{ history: HistoryItem[] }>(`/workouts/exercise/${encodeURIComponent(name)}/history`);
      setHistory(res.history);
      const s = await apiFetch<{ series: SeriesPoint[] }>(`/progression/exercise/${encodeURIComponent(name)}/series`);
      setSeries(s.series);
    })().catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [name]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 24 }}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.muted }}>← Back</Text>
      </Pressable>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 10 }}>{name}</Text>
      <Text style={{ color: colors.muted, marginTop: 6 }}>Top set over time</Text>

      {error ? <Text style={{ color: colors.danger, marginTop: 10 }}>{error}</Text> : null}

      <View style={{ marginTop: 10, padding: 14, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
        <ProgressChart points={series} unit="kg" />
      </View>

      <View style={{ marginTop: 16, gap: 10 }}>
        {history.map((h, idx) => (
          <View key={idx} style={{ padding: 14, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text, fontWeight: "900" }}>{h.performedAt.slice(0, 10)}</Text>
            <Text style={{ color: colors.muted, marginTop: 6 }}>Top: {h.topWeightKg} kg</Text>
            <Text style={{ color: colors.muted, marginTop: 2, fontSize: 12 }}>
              Sets: {h.sets.map((s) => `${s.reps}x${s.weightKg}`).join(" • ")}
            </Text>
          </View>
        ))}
        {history.length === 0 ? <Text style={{ color: colors.muted }}>No history yet.</Text> : null}
      </View>
    </ScrollView>
  );
}

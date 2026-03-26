import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { apiFetch } from "../api/client";
import { colors } from "../theme";
import { ModeTimeline } from "../components/ModeTimeline";

type ModePhase = {
  mode: "cutting" | "bulking" | "equilibrium";
  startDate: string;
  endDate?: string;
};

export function MainScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [calorieTarget, setCalorieTarget] = useState<number | null>(null);
  const [mode, setMode] = useState<"cutting" | "bulking" | "equilibrium">("equilibrium");
  const [phases, setPhases] = useState<ModePhase[]>([]);

  async function refresh() {
    const p = await apiFetch<any>("/profile");
    setProfile(p.profile);
    setTdee(p.tdee);
    setCalorieTarget(p.calorieTarget);
    setMode(p.mode);
    const m = await apiFetch<{ phases: ModePhase[] }>("/modes");
    setPhases(m.phases);
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  async function switchMode(next: typeof mode) {
    await apiFetch("/modes/start", { method: "POST", json: { mode: next } });
    refresh().catch(() => undefined);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>Today</Text>
      <Text style={{ color: colors.muted, marginTop: 6 }}>
        {profile ? `Hi ${profile.name}.` : "Create a profile to unlock calorie targets."}
      </Text>

      <View
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 16,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border
        }}
      >
        <Text style={{ color: colors.muted }}>Mode</Text>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "800", marginTop: 6 }}>
          {mode}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>
          {tdee
            ? `Equilibrium: ${tdee} kcal • Target: ${calorieTarget ?? tdee} kcal`
            : "Complete onboarding to calculate TDEE."}
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
          {(["cutting", "equilibrium", "bulking"] as const).map((m) => (
            <Pressable
              key={m}
              onPress={() => switchMode(m)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 12,
                backgroundColor: m === mode ? colors.primary : colors.bg,
                borderWidth: 1,
                borderColor: colors.border
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "800",
                  color: m === mode ? "#051018" : colors.text
                }}
              >
                {m}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ModeTimeline phases={phases} />

      <View
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 16,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "800" }}>Progress charts</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>
          Hook up a chart component to `/progression/exercise/:name/series` for interactive graphs.
        </Text>
      </View>
    </ScrollView>
  );
}


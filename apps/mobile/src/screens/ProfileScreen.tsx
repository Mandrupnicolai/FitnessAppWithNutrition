import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { apiFetch } from "../api/client";
import { colors } from "../theme";

export function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [weightKg, setWeightKg] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const p = await apiFetch<any>("/profile");
    setProfile(p.profile);
    setTdee(p.tdee);
    setWeightKg(p.profile?.weightKg ? String(p.profile.weightKg) : "");
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  async function saveWeight() {
    setError(null);
    try {
      if (!profile) return;
      await apiFetch("/profile", {
        method: "PUT",
        json: { ...profile, weightKg: Number(weightKg) }
      });
      refresh().catch(() => undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800" }}>Profile</Text>
      {!profile ? (
        <Text style={{ color: colors.muted, marginTop: 10 }}>No profile yet.</Text>
      ) : (
        <>
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
            <Text style={{ color: colors.muted }}>Equilibrium (TDEE)</Text>
            <Text style={{ color: colors.text, fontSize: 28, fontWeight: "900", marginTop: 6 }}>
              {tdee ?? "—"} kcal
            </Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              {profile.heightCm} cm • {profile.weightKg} kg • {profile.activityLevel}
            </Text>
          </View>

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
            <Text style={{ color: colors.text, fontWeight: "800" }}>Update weight</Text>
            <TextInput
              value={weightKg}
              onChangeText={setWeightKg}
              keyboardType="numeric"
              placeholder="Weight (kg)"
              placeholderTextColor={colors.muted}
              style={{
                marginTop: 10,
                color: colors.text,
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.bg,
                borderWidth: 1,
                borderColor: colors.border
              }}
            />
            {error ? <Text style={{ color: colors.danger, marginTop: 10 }}>{error}</Text> : null}
            <Pressable
              onPress={saveWeight}
              style={{ marginTop: 12, backgroundColor: colors.primary, padding: 12, borderRadius: 12 }}
            >
              <Text style={{ color: "#051018", fontWeight: "900", textAlign: "center" }}>Save</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}


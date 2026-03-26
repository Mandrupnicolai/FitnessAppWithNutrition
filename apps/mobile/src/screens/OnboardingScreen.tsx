import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { apiFetch } from "../api/client";
import { colors } from "../theme";

type ProfileResponse = { profile: unknown | null };

export function OnboardingScreen({ navigation }: { navigation: any }) {
  const [name, setName] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [ageYears, setAgeYears] = useState("30");
  const [heightCm, setHeightCm] = useState("180");
  const [weightKg, setWeightKg] = useState("80");
  const [trainingFreq, setTrainingFreq] = useState("3");
  const [activityLevel, setActivityLevel] = useState<
    "sedentary" | "light" | "moderate" | "very" | "athlete"
  >("moderate");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch<ProfileResponse>("/profile");
        if (res.profile) navigation.replace("Main");
      } catch {
        // ignore
      }
    })();
  }, [navigation]);

  async function save() {
    setError(null);
    try {
      await apiFetch("/profile", {
        method: "PUT",
        json: {
          name,
          sex,
          ageYears: Number(ageYears),
          heightCm: Number(heightCm),
          weightKg: Number(weightKg),
          trainingFrequencyPerWeek: Number(trainingFreq),
          activityLevel
        }
      });
      await apiFetch("/modes/start", {
        method: "POST",
        json: { mode: "equilibrium" }
      });
      navigation.replace("Main");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "700" }}>
        Create your profile
      </Text>
      <Text style={{ color: colors.muted, marginTop: 6 }}>
        This powers equilibrium calories and progressive overload suggestions.
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor={colors.muted}
        style={{
          marginTop: 16,
          color: colors.text,
          padding: 12,
          borderRadius: 12,
          backgroundColor: colors.card
        }}
      />

      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        <Pressable
          onPress={() => setSex("male")}
          style={{
            flex: 1,
            backgroundColor: sex === "male" ? colors.primary : colors.card,
            padding: 12,
            borderRadius: 12
          }}
        >
          <Text
            style={{
              color: sex === "male" ? "#051018" : colors.text,
              textAlign: "center",
              fontWeight: "700"
            }}
          >
            Male
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSex("female")}
          style={{
            flex: 1,
            backgroundColor: sex === "female" ? colors.primary : colors.card,
            padding: 12,
            borderRadius: 12
          }}
        >
          <Text
            style={{
              color: sex === "female" ? "#051018" : colors.text,
              textAlign: "center",
              fontWeight: "700"
            }}
          >
            Female
          </Text>
        </Pressable>
      </View>

      <TextInput
        value={ageYears}
        onChangeText={setAgeYears}
        keyboardType="numeric"
        placeholder="Age (years)"
        placeholderTextColor={colors.muted}
        style={{
          marginTop: 12,
          color: colors.text,
          padding: 12,
          borderRadius: 12,
          backgroundColor: colors.card
        }}
      />
      <TextInput
        value={heightCm}
        onChangeText={setHeightCm}
        keyboardType="numeric"
        placeholder="Height (cm)"
        placeholderTextColor={colors.muted}
        style={{
          marginTop: 12,
          color: colors.text,
          padding: 12,
          borderRadius: 12,
          backgroundColor: colors.card
        }}
      />
      <TextInput
        value={weightKg}
        onChangeText={setWeightKg}
        keyboardType="numeric"
        placeholder="Weight (kg)"
        placeholderTextColor={colors.muted}
        style={{
          marginTop: 12,
          color: colors.text,
          padding: 12,
          borderRadius: 12,
          backgroundColor: colors.card
        }}
      />
      <TextInput
        value={trainingFreq}
        onChangeText={setTrainingFreq}
        keyboardType="numeric"
        placeholder="Training days per week"
        placeholderTextColor={colors.muted}
        style={{
          marginTop: 12,
          color: colors.text,
          padding: 12,
          borderRadius: 12,
          backgroundColor: colors.card
        }}
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {(["sedentary", "light", "moderate", "very", "athlete"] as const).map((lvl) => (
          <Pressable
            key={lvl}
            onPress={() => setActivityLevel(lvl)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor: activityLevel === lvl ? colors.primary : colors.card
            }}
          >
            <Text style={{ color: activityLevel === lvl ? "#051018" : colors.text, fontWeight: "700" }}>
              {lvl}
            </Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text style={{ color: colors.danger, marginTop: 12 }}>{error}</Text> : null}

      <Pressable
        onPress={save}
        style={{
          marginTop: 18,
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 12
        }}
      >
        <Text style={{ color: "#051018", fontWeight: "800", textAlign: "center" }}>
          Continue
        </Text>
      </Pressable>
    </ScrollView>
  );
}


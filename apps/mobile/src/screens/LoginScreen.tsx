import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useAuth } from "../store/auth";
import { apiFetch } from "../api/client";
import { colors } from "../theme";

export function LoginScreen() {
  const setToken = useAuth((s) => s.setToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    try {
      const path = isRegister ? "/auth/register" : "/auth/login";
      const res = await apiFetch<{ token: string }>(path, {
        method: "POST",
        json: { email, password }
      });
      setToken(res.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        backgroundColor: colors.bg,
        justifyContent: "center"
      }}
    >
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "700" }}>
        {isRegister ? "Create account" : "Log in"}
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        style={{
          marginTop: 16,
          color: colors.text,
          padding: 12,
          borderRadius: 12,
          backgroundColor: colors.card
        }}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={colors.muted}
        secureTextEntry
        style={{
          marginTop: 12,
          color: colors.text,
          padding: 12,
          borderRadius: 12,
          backgroundColor: colors.card
        }}
      />
      {error ? (
        <Text style={{ color: colors.danger, marginTop: 12 }}>{error}</Text>
      ) : null}
      <Pressable
        onPress={submit}
        style={{
          marginTop: 16,
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
          {isRegister ? "Register" : "Log in"}
        </Text>
      </Pressable>
      <Pressable onPress={() => setIsRegister((v) => !v)} style={{ marginTop: 12 }}>
        <Text style={{ color: colors.muted, textAlign: "center" }}>
          {isRegister ? "Have an account? Log in" : "New here? Create an account"}
        </Text>
      </Pressable>
    </View>
  );
}


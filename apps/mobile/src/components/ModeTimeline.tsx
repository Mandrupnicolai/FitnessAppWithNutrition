import React from "react";
import { View, Text } from "react-native";
import { colors } from "../theme";

type Phase = {
  mode: "cutting" | "bulking" | "equilibrium";
  startDate: string;
  endDate?: string;
};

function phaseColor(mode: Phase["mode"]) {
  if (mode === "cutting") return colors.cut;
  if (mode === "bulking") return colors.bulk;
  return colors.eq;
}

export function ModeTimeline({ phases }: { phases: Phase[] }) {
  const shown = phases.slice(0, 6);
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ color: colors.muted, marginBottom: 8 }}>Phases</Text>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {shown.map((p, idx) => (
          <View
            key={idx}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 12
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: phaseColor(p.mode)
                }}
              />
              <Text style={{ color: colors.text, fontWeight: "700" }}>{p.mode}</Text>
            </View>
            <Text style={{ color: colors.muted, marginTop: 4, fontSize: 12 }}>
              {p.startDate.slice(0, 10)}
              {p.endDate ? ` → ${p.endDate.slice(0, 10)}` : " → now"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}


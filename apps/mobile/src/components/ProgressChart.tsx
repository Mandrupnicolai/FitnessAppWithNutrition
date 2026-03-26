import React from "react";
import { Dimensions, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors } from "../theme";

export type Point = { date: string; value: number };

export function ProgressChart({ points, unit }: { points: Point[]; unit?: string }) {
  if (!points.length) {
    return <Text style={{ color: colors.muted }}>No data yet.</Text>;
  }

  const width = Math.min(Dimensions.get("window").width - 48, 520);
  const labels = points.slice(-6).map((p) => p.date.slice(5));
  const data = points.slice(-6).map((p) => p.value);

  return (
    <View style={{ marginTop: 10 }}>
      <LineChart
        data={{
          labels,
          datasets: [{ data }]
        }}
        width={width}
        height={220}
        yAxisSuffix={unit ? ` ${unit}` : ""}
        chartConfig={{
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          color: () => colors.primary,
          labelColor: () => colors.muted,
          propsForDots: { r: "3" },
          decimalPlaces: 0
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}


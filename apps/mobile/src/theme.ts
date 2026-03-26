import { DarkTheme } from "@react-navigation/native";

export const colors = {
  bg: "#0B0F14",
  card: "#101826",
  text: "#E7EEF7",
  muted: "#A0AEC0",
  primary: "#6EE7FF",
  danger: "#FF5C7A",
  cut: "#FF5C7A",
  bulk: "#7CFFB2",
  eq: "#6EE7FF",
  border: "#243244"
};

export const theme = {
  nav: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.bg,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary
    }
  }
};


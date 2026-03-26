import type { ActivityLevel, ProfileDoc } from "../models/Profile.js";
import type { GoalMode } from "../models/ModePhase.js";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  athlete: 1.9
};

export function calcBmr(
  profile: Pick<ProfileDoc, "sex" | "ageYears" | "heightCm" | "weightKg">
) {
  // Mifflin-St Jeor
  const base =
    10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.ageYears;
  return profile.sex === "male" ? base + 5 : base - 161;
}

export function calcTdee(
  profile: Pick<
    ProfileDoc,
    "sex" | "ageYears" | "heightCm" | "weightKg" | "activityLevel"
  >
) {
  const bmr = calcBmr(profile);
  const mult = activityMultipliers[profile.activityLevel];
  return Math.round(bmr * mult);
}

export function calorieTarget(tdee: number, mode: GoalMode) {
  if (mode === "cutting") return Math.round(tdee * 0.85);
  if (mode === "bulking") return Math.round(tdee * 1.1);
  return tdee;
}


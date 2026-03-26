import { z } from "zod";

export const goalModeSchema = z.enum(["cutting", "bulking", "equilibrium"]);

export const activityLevelSchema = z.enum([
  "sedentary",
  "light",
  "moderate",
  "very",
  "athlete"
]);

export const sexSchema = z.enum(["male", "female"]);


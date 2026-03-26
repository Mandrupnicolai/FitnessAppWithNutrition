import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { ProfileModel } from "../models/Profile.js";
import { ModePhaseModel } from "../models/ModePhase.js";
import { activityLevelSchema, goalModeSchema, sexSchema } from "../utils/zod.js";
import { calcTdee, calorieTarget } from "../utils/calc.js";

export const profileRouter = Router();
profileRouter.use(requireAuth);

const upsertSchema = z.object({
  name: z.string().min(1).max(120),
  sex: sexSchema,
  ageYears: z.number().int().min(10).max(120),
  heightCm: z.number().min(90).max(250),
  weightKg: z.number().min(25).max(400),
  trainingFrequencyPerWeek: z.number().int().min(0).max(14),
  activityLevel: activityLevelSchema
});

profileRouter.get("/", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const profile = await ProfileModel.findOne({ userId }).lean();
  const active = await ModePhaseModel.findOne({ userId, endDate: { $exists: false } })
    .sort({ startDate: -1 })
    .lean();

  if (!profile)
    return res.json({
      profile: null,
      tdee: null,
      calorieTarget: null,
      mode: active?.mode ?? "equilibrium"
    });

  const tdee = calcTdee(profile);
  const mode = (active?.mode ?? "equilibrium") as z.infer<typeof goalModeSchema>;
  return res.json({
    profile,
    tdee,
    calorieTarget: calorieTarget(tdee, mode),
    mode
  });
});

profileRouter.put("/", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const body = upsertSchema.parse(req.body);

  const profile = await ProfileModel.findOneAndUpdate(
    { userId },
    { $set: { ...body, userId } },
    { upsert: true, new: true }
  ).lean();

  const tdee = calcTdee(profile);
  return res.json({ profile, tdee });
});


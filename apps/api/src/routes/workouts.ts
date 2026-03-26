import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { WorkoutLogModel } from "../models/WorkoutLog.js";
import { TrainingDayModel } from "../models/TrainingDay.js";
import { evaluateAchievementsForUser } from "../services/achievements.js";
import { AchievementModel } from "../models/Achievement.js";

export const workoutsRouter = Router();
workoutsRouter.use(requireAuth);

workoutsRouter.get("/", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const logs = await WorkoutLogModel.find({ userId }).sort({ performedAt: -1 }).limit(50).lean();
  return res.json({ workouts: logs });
});

const setSchema = z.object({
  reps: z.number().int().min(0).max(200),
  weightKg: z.number().min(0).max(500)
});

const exerciseSchema = z.object({
  name: z.string().min(1).max(120),
  sets: z.array(setSchema).min(1)
});

const createSchema = z.object({
  trainingDayId: z.string().min(1),
  performedAt: z.string().datetime().optional(),
  exercises: z.array(exerciseSchema).min(1)
});

workoutsRouter.post("/", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const body = createSchema.parse(req.body);

  const day = await TrainingDayModel.findOne({ _id: body.trainingDayId, userId }).lean();
  if (!day) return res.status(404).json({ error: "TrainingDayNotFound" });

  const performedAt = body.performedAt ? new Date(body.performedAt) : new Date();
  const log = await WorkoutLogModel.create({
    userId,
    trainingDayId: body.trainingDayId,
    performedAt,
    exercises: body.exercises
  });

  await evaluateAchievementsForUser(userId, String(log._id));
  return res.status(201).json({ workout: log });
});

workoutsRouter.get("/exercise/:name/history", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const name = decodeURIComponent(req.params.name);

  const logs = await WorkoutLogModel.find({ userId, "exercises.name": name })
    .sort({ performedAt: -1 })
    .limit(100)
    .lean();

  const history = logs.map((log) => {
    const ex = log.exercises.find((e) => e.name === name);
    const top = ex?.sets.reduce((m, s) => Math.max(m, s.weightKg), 0) ?? 0;
    return { performedAt: log.performedAt, topWeightKg: top, sets: ex?.sets ?? [] };
  });

  return res.json({ exerciseName: name, history });
});

workoutsRouter.get("/achievements", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const achievements = await AchievementModel.find({ userId }).sort({ createdAt: -1 }).lean();
  return res.json({ achievements });
});


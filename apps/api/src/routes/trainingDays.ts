import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { TrainingDayModel } from "../models/TrainingDay.js";

export const trainingDaysRouter = Router();
trainingDaysRouter.use(requireAuth);

trainingDaysRouter.get("/", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const days = await TrainingDayModel.find({ userId }).sort({ updatedAt: -1 }).lean();
  return res.json({ trainingDays: days });
});

trainingDaysRouter.get("/:id", async (req, res) => {
  const { userId } = req as unknown as AuthedRequest;
  const day = await TrainingDayModel.findOne({ _id: req.params.id, userId }).lean();
  if (!day) return res.status(404).json({ error: "NotFound" });
  return res.json({ trainingDay: day });
});

const exerciseSchema = z.object({
  name: z.string().min(1).max(120),
  sets: z.number().int().min(1).max(20),
  reps: z.number().int().min(1).max(100),
  weightKg: z.number().min(0).max(500).optional(),
  notes: z.string().max(500).optional()
});

const upsertSchema = z.object({
  name: z.string().min(1).max(120),
  exercises: z.array(exerciseSchema).default([])
});

trainingDaysRouter.post("/", async (req, res) => {
  const { userId } = req as unknown as AuthedRequest;
  const body = upsertSchema.parse(req.body);
  const created = await TrainingDayModel.create({ ...body, userId });
  return res.json({ trainingDay: created });
});

trainingDaysRouter.delete("/:id", async (req, res) => {
  const { userId } = req as unknown as AuthedRequest;
  const deleted = await TrainingDayModel.findOneAndDelete({ _id: req.params.id, userId }).lean();
  if (!deleted) return res.status(404).json({ error: "NotFound" });
  return res.json({ ok: true });
});

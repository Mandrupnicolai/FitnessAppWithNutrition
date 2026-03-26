import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { ModePhaseModel } from "../models/ModePhase.js";
import { goalModeSchema } from "../utils/zod.js";

export const modesRouter = Router();
modesRouter.use(requireAuth);

modesRouter.get("/", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const phases = await ModePhaseModel.find({ userId }).sort({ startDate: -1 }).lean();
  return res.json({ phases });
});

const startSchema = z.object({ mode: goalModeSchema });

modesRouter.post("/start", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const { mode } = startSchema.parse(req.body);

  const open = await ModePhaseModel.findOne({ userId, endDate: { $exists: false } })
    .sort({ startDate: -1 })
    .lean();

  const now = new Date();
  if (open && open.mode === mode) return res.json({ phase: open });

  if (open) {
    await ModePhaseModel.updateOne({ _id: open._id }, { $set: { endDate: now } });
  }

  const phase = await ModePhaseModel.create({ userId, mode, startDate: now });
  return res.status(201).json({ phase });
});


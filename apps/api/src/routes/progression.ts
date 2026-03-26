import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { getExerciseSeries, suggestNext } from "../services/progression.js";

export const progressionRouter = Router();
progressionRouter.use(requireAuth);

progressionRouter.get("/exercise/:name/series", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const exerciseName = decodeURIComponent(req.params.name);
  const series = await getExerciseSeries(userId, exerciseName);
  return res.json({ exerciseName, series });
});

const suggestSchema = z.object({ exerciseName: z.string().min(1).max(120) });

progressionRouter.post("/suggest", async (req, res) => {
  const { userId } = req as AuthedRequest;
  const { exerciseName } = suggestSchema.parse(req.body);
  const suggestion = await suggestNext(userId, exerciseName);
  return res.json({ suggestion });
});


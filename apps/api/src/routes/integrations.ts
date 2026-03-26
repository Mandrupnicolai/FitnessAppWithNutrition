import { Router } from "express";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";

export const integrationsRouter = Router();
integrationsRouter.use(requireAuth);

integrationsRouter.get("/fitbit/status", (_req, res) => {
  const enabled = Boolean(env.FITBIT_CLIENT_ID && env.FITBIT_CLIENT_SECRET);
  return res.json({ enabled });
});

integrationsRouter.get("/nutritionix/status", (_req, res) => {
  const enabled = Boolean(env.NUTRITIONIX_APP_ID && env.NUTRITIONIX_API_KEY);
  return res.json({ enabled });
});

integrationsRouter.get("/nutritionix/search", (_req, res) => {
  const enabled = Boolean(env.NUTRITIONIX_APP_ID && env.NUTRITIONIX_API_KEY);
  if (!enabled) return res.status(501).json({ error: "NutritionixNotConfigured" });
  return res.status(501).json({
    error: "NotImplemented",
    hint: "Implement server-side fetch + caching here."
  });
});


import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.js";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { modesRouter } from "./routes/modes.js";
import { trainingDaysRouter } from "./routes/trainingDays.js";
import { workoutsRouter } from "./routes/workouts.js";
import { progressionRouter } from "./routes/progression.js";
import { integrationsRouter } from "./routes/integrations.js";
import { billingRouter, billingWebhookHandler } from "./routes/billing.js";

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  );
  app.use(
    cors({
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(","),
      credentials: true
    })
  );
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 120
    })
  );

  // Stripe webhooks need raw body (must run before express.json)
  app.post(
    "/billing/webhook",
    express.raw({ type: "application/json" }),
    billingWebhookHandler
  );

  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/auth", authRouter);
  app.use("/profile", profileRouter);
  app.use("/modes", modesRouter);
  app.use("/training-days", trainingDaysRouter);
  app.use("/workouts", workoutsRouter);
  app.use("/progression", progressionRouter);
  app.use("/integrations", integrationsRouter);
  app.use("/billing", billingRouter);

  app.use(errorMiddleware);
  return app;
}

import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  API_PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/fitness_app"),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string().default("*"),

  FITBIT_CLIENT_ID: z.string().optional().default(""),
  FITBIT_CLIENT_SECRET: z.string().optional().default(""),
  FITBIT_REDIRECT_URI: z.string().optional().default(""),

  NUTRITIONIX_APP_ID: z.string().optional().default(""),
  NUTRITIONIX_API_KEY: z.string().optional().default(""),

  STRIPE_SECRET_KEY: z.string().optional().default(""),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default("")
});

export const env = envSchema.parse(process.env);


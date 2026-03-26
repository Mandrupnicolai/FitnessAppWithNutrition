import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserModel } from "../models/User.js";
import { signJwt } from "../utils/jwt.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200)
});

authRouter.post("/register", async (req, res) => {
  const body = registerSchema.parse(req.body);
  const existing = await UserModel.findOne({ email: body.email }).lean();
  if (existing) return res.status(409).json({ error: "EmailAlreadyInUse" });

  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await UserModel.create({ email: body.email, passwordHash });

  const token = signJwt({ sub: String(user._id) }, 60 * 60 * 24 * 30);
  return res.status(201).json({ token });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200)
});

authRouter.post("/login", async (req, res) => {
  const body = loginSchema.parse(req.body);
  const user = await UserModel.findOne({ email: body.email });
  if (!user) return res.status(401).json({ error: "InvalidCredentials" });

  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "InvalidCredentials" });

  const token = signJwt({ sub: String(user._id) }, 60 * 60 * 24 * 30);
  return res.json({ token });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const { userId } = req as AuthedRequest;
  const user = await UserModel.findById(userId).select("email createdAt").lean();
  return res.json({ user });
});


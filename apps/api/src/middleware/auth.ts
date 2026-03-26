import type { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { env } from "../config/env.js";
import { UserModel } from "../models/User.js";

function verifyJwt(token: string) {
  const [headerB64, payloadB64, signatureB64] = token.split(".");
  if (!headerB64 || !payloadB64 || !signatureB64) return null;

  const expected = crypto
    .createHmac("sha256", env.JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");

  if (expected !== signatureB64) return null;
  try {
    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    return JSON.parse(payloadJson) as { sub: string; exp: number };
  } catch {
    return null;
  }
}

export type AuthedRequest = Request & { userId: string };

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.header("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  const payload = token ? verifyJwt(token) : null;
  if (!payload) return res.status(401).json({ error: "Unauthorized" });

  if (payload.exp * 1000 < Date.now()) {
    return res.status(401).json({ error: "TokenExpired" });
  }

  const user = await UserModel.findById(payload.sub).select("_id").lean();
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  (req as AuthedRequest).userId = String(user._id);
  next();
}


import mongoose, { Schema } from "mongoose";

export type AchievementKind =
  | "first_workout"
  | "workout_10"
  | "workout_50"
  | "streak_3"
  | "streak_7"
  | "new_pr";

export type AchievementDoc = {
  userId: mongoose.Types.ObjectId;
  kind: AchievementKind;
  title: string;
  description: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

const achievementSchema = new Schema<AchievementDoc>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    kind: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, required: false }
  },
  { timestamps: true }
);

achievementSchema.index({ userId: 1, kind: 1 }, { unique: true });

export const AchievementModel = mongoose.model<AchievementDoc>(
  "Achievement",
  achievementSchema
);


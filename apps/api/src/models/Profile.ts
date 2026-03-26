import mongoose, { Schema } from "mongoose";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very"
  | "athlete";

export type Sex = "male" | "female";

export type ProfileDoc = {
  userId: mongoose.Types.ObjectId;
  name: string;
  sex: Sex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  trainingFrequencyPerWeek: number;
  activityLevel: ActivityLevel;
  updatedAt: Date;
  createdAt: Date;
};

const profileSchema = new Schema<ProfileDoc>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true },
    name: { type: String, required: true },
    sex: { type: String, required: true, enum: ["male", "female"] },
    ageYears: { type: Number, required: true, min: 10, max: 120 },
    heightCm: { type: Number, required: true, min: 90, max: 250 },
    weightKg: { type: Number, required: true, min: 25, max: 400 },
    trainingFrequencyPerWeek: { type: Number, required: true, min: 0, max: 14 },
    activityLevel: {
      type: String,
      required: true,
      enum: ["sedentary", "light", "moderate", "very", "athlete"]
    }
  },
  { timestamps: true }
);

export const ProfileModel = mongoose.model<ProfileDoc>("Profile", profileSchema);


import mongoose, { Schema } from "mongoose";

export type ExerciseTemplate = {
  _id: mongoose.Types.ObjectId;
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
  notes?: string;
};

export type TrainingDayDoc = {
  userId: mongoose.Types.ObjectId;
  name: string;
  exercises: ExerciseTemplate[];
  createdAt: Date;
  updatedAt: Date;
};

const exerciseTemplateSchema = new Schema<ExerciseTemplate>(
  {
    name: { type: String, required: true },
    sets: { type: Number, required: true, min: 1, max: 20 },
    reps: { type: Number, required: true, min: 1, max: 100 },
    weightKg: { type: Number, required: false, min: 0, max: 500 },
    notes: { type: String, required: false }
  },
  { _id: true }
);

const trainingDaySchema = new Schema<TrainingDayDoc>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true },
    exercises: { type: [exerciseTemplateSchema], required: true, default: [] }
  },
  { timestamps: true }
);

export const TrainingDayModel = mongoose.model<TrainingDayDoc>(
  "TrainingDay",
  trainingDaySchema
);


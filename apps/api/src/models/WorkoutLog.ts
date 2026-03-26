import mongoose, { Schema } from "mongoose";

export type WorkoutSet = {
  reps: number;
  weightKg: number;
};

export type WorkoutExerciseLog = {
  name: string;
  sets: WorkoutSet[];
};

export type WorkoutLogDoc = {
  userId: mongoose.Types.ObjectId;
  trainingDayId: mongoose.Types.ObjectId;
  performedAt: Date;
  exercises: WorkoutExerciseLog[];
  createdAt: Date;
  updatedAt: Date;
};

const workoutSetSchema = new Schema<WorkoutSet>(
  {
    reps: { type: Number, required: true, min: 0, max: 200 },
    weightKg: { type: Number, required: true, min: 0, max: 500 }
  },
  { _id: false }
);

const workoutExerciseSchema = new Schema<WorkoutExerciseLog>(
  {
    name: { type: String, required: true },
    sets: { type: [workoutSetSchema], required: true, default: [] }
  },
  { _id: false }
);

const workoutLogSchema = new Schema<WorkoutLogDoc>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    trainingDayId: { type: Schema.Types.ObjectId, required: true, index: true },
    performedAt: { type: Date, required: true, index: true },
    exercises: { type: [workoutExerciseSchema], required: true, default: [] }
  },
  { timestamps: true }
);

workoutLogSchema.index({ userId: 1, performedAt: -1 });

export const WorkoutLogModel = mongoose.model<WorkoutLogDoc>(
  "WorkoutLog",
  workoutLogSchema
);


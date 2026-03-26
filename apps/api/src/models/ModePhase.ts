import mongoose, { Schema } from "mongoose";

export type GoalMode = "cutting" | "bulking" | "equilibrium";

export type ModePhaseDoc = {
  userId: mongoose.Types.ObjectId;
  mode: GoalMode;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const modePhaseSchema = new Schema<ModePhaseDoc>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    mode: {
      type: String,
      required: true,
      enum: ["cutting", "bulking", "equilibrium"]
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: false }
  },
  { timestamps: true }
);

modePhaseSchema.index({ userId: 1, startDate: -1 });

export const ModePhaseModel = mongoose.model<ModePhaseDoc>(
  "ModePhase",
  modePhaseSchema
);


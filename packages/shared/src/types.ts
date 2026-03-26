export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very"
  | "athlete";

export type GoalMode = "cutting" | "bulking" | "equilibrium";

export type Sex = "male" | "female";

export type UserProfile = {
  name: string;
  sex: Sex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  trainingFrequencyPerWeek: number;
  activityLevel: ActivityLevel;
};

export type ModePhase = {
  id: string;
  mode: GoalMode;
  startDate: string;
  endDate?: string;
};

export type ExerciseTemplate = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
  notes?: string;
};

export type TrainingDay = {
  id: string;
  name: string;
  exercises: ExerciseTemplate[];
};

export type WorkoutSet = {
  reps: number;
  weightKg: number;
};

export type WorkoutExerciseLog = {
  name: string;
  sets: WorkoutSet[];
};

export type WorkoutLog = {
  id: string;
  trainingDayId: string;
  performedAt: string;
  exercises: WorkoutExerciseLog[];
};

export type ProgressPoint = {
  date: string;
  value: number;
};

export type Suggestion = {
  exerciseName: string;
  suggestedWeightKg: number;
  suggestedReps: number;
  rationale: string;
};


import { WorkoutLogModel } from "../models/WorkoutLog.js";

function roundToIncrement(value: number, increment: number) {
  return Math.round(value / increment) * increment;
}

export async function getExerciseSeries(userId: string, exerciseName: string) {
  const logs = await WorkoutLogModel.find({
    userId,
    "exercises.name": exerciseName
  })
    .sort({ performedAt: 1 })
    .lean();

  const points = logs.map((log) => {
    const ex = log.exercises.find((e) => e.name === exerciseName);
    const topSet =
      ex?.sets.reduce((max, s) => Math.max(max, s.weightKg), 0) ?? 0;
    return { date: log.performedAt.toISOString().slice(0, 10), value: topSet };
  });

  return points;
}

export async function suggestNext(userId: string, exerciseName: string) {
  const latest = await WorkoutLogModel.findOne({
    userId,
    "exercises.name": exerciseName
  })
    .sort({ performedAt: -1 })
    .lean();

  if (!latest) {
    return {
      exerciseName,
      suggestedWeightKg: 20,
      suggestedReps: 8,
      rationale:
        "No history yet — start with a conservative baseline and adjust."
    };
  }

  const ex = latest.exercises.find((e) => e.name === exerciseName);
  const lastSet = ex?.sets.at(-1);
  const lastWeight = lastSet?.weightKg ?? 0;
  const lastReps = lastSet?.reps ?? 0;

  // Simple progressive overload heuristic:
  // - If last set reached >= 8 reps, increase weight 2.5%
  // - If < 6 reps, keep weight and aim +1 rep
  // - Else keep weight and aim 8 reps
  if (lastWeight === 0) {
    return {
      exerciseName,
      suggestedWeightKg: 20,
      suggestedReps: 8,
      rationale:
        "Missing weight history — set a baseline and track consistently."
    };
  }

  if (lastReps >= 8) {
    const inc = Math.max(2.5, lastWeight * 0.025);
    const suggested = roundToIncrement(lastWeight + inc, 2.5);
    return {
      exerciseName,
      suggestedWeightKg: suggested,
      suggestedReps: 6,
      rationale: `You hit ${lastReps} reps — nudge weight up and rebuild reps.`
    };
  }

  if (lastReps < 6) {
    return {
      exerciseName,
      suggestedWeightKg: lastWeight,
      suggestedReps: lastReps + 1,
      rationale: `Last set was ${lastReps} reps — keep weight and add reps first.`
    };
  }

  return {
    exerciseName,
    suggestedWeightKg: lastWeight,
    suggestedReps: 8,
    rationale: "Stay at the same load and push reps to the top of the range."
  };
}


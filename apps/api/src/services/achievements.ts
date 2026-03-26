import { AchievementModel } from "../models/Achievement.js";
import { WorkoutLogModel } from "../models/WorkoutLog.js";

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function evaluateAchievementsForUser(
  userId: string,
  newestWorkoutId?: string
) {
  const total = await WorkoutLogModel.countDocuments({ userId });
  const upserts: Array<Promise<unknown>> = [];

  if (total >= 1) {
    upserts.push(
      AchievementModel.updateOne(
        { userId, kind: "first_workout" },
        {
          $setOnInsert: {
            userId,
            kind: "first_workout",
            title: "First Workout",
            description: "Logged your first workout."
          }
        },
        { upsert: true }
      )
    );
  }
  if (total >= 10) {
    upserts.push(
      AchievementModel.updateOne(
        { userId, kind: "workout_10" },
        {
          $setOnInsert: {
            userId,
            kind: "workout_10",
            title: "10 Workouts",
            description: "Logged 10 workouts."
          }
        },
        { upsert: true }
      )
    );
  }
  if (total >= 50) {
    upserts.push(
      AchievementModel.updateOne(
        { userId, kind: "workout_50" },
        {
          $setOnInsert: {
            userId,
            kind: "workout_50",
            title: "50 Workouts",
            description: "Logged 50 workouts."
          }
        },
        { upsert: true }
      )
    );
  }

  const lastLogs = await WorkoutLogModel.find({ userId })
    .sort({ performedAt: -1 })
    .limit(14)
    .lean();

  const uniqueDays = Array.from(
    new Set(lastLogs.map((l) => dayKey(l.performedAt)))
  );
  let streak = 0;
  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (uniqueDays.includes(dayKey(expected))) streak++;
    else break;
  }

  if (streak >= 3) {
    upserts.push(
      AchievementModel.updateOne(
        { userId, kind: "streak_3" },
        {
          $setOnInsert: {
            userId,
            kind: "streak_3",
            title: "3-Day Streak",
            description: "Logged workouts on 3 consecutive days."
          }
        },
        { upsert: true }
      )
    );
  }
  if (streak >= 7) {
    upserts.push(
      AchievementModel.updateOne(
        { userId, kind: "streak_7" },
        {
          $setOnInsert: {
            userId,
            kind: "streak_7",
            title: "7-Day Streak",
            description: "Logged workouts on 7 consecutive days."
          }
        },
        { upsert: true }
      )
    );
  }

  if (newestWorkoutId) {
    const log = await WorkoutLogModel.findById(newestWorkoutId).lean();
    if (log) {
      for (const ex of log.exercises) {
        const top = ex.sets.reduce((m, s) => Math.max(m, s.weightKg), 0);
        const previous = await WorkoutLogModel.findOne({
          userId,
          _id: { $ne: log._id },
          "exercises.name": ex.name
        })
          .sort({ performedAt: -1 })
          .lean();

        const prevEx = previous?.exercises.find((e) => e.name === ex.name);
        const prevTop =
          prevEx?.sets.reduce((m, s) => Math.max(m, s.weightKg), 0) ?? 0;
        if (top > prevTop && top > 0) {
          upserts.push(
            AchievementModel.updateOne(
              { userId, kind: "new_pr" },
              {
                $set: {
                  userId,
                  kind: "new_pr",
                  title: "New PR",
                  description: `New personal record in ${ex.name}.`,
                  meta: { exercise: ex.name, weightKg: top }
                }
              },
              { upsert: true }
            )
          );
        }
      }
    }
  }

  await Promise.all(upserts);
}


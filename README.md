# Fitness Application (Health + Nutriotion)

Monorepo with:
- `apps/api`: Node.js + Express + MongoDB (REST API)
- `apps/mobile`: React Native (Expo) mobile app (iOS/Android)
- `packages/shared`: shared TypeScript types

## Quick start (local dev)

### Prereqs
- Node.js 20+
- Docker Desktop (for MongoDB)

### 1) Start MongoDB
```powershell
cd apps/api
docker compose up -d
```

Backup/restore (optional):
```powershell
cd apps/api
.\src\scripts\backup.ps1
.\src\scripts\restore.ps1 -ArchivePath .\backups\backup-YYYYMMDD-HHMMSS.archive
```

### 2) Configure env
Copy the repo `.env.example` values into:
- `apps/api/.env`
- `apps/mobile/.env` (Expo public vars)

### 3) Run API
```powershell
cd apps/api
npm install
npm run dev
```

API listens on `http://localhost:4000` by default.

### 4) Run mobile app
```powershell
cd apps/mobile
npm install
npx expo start
```

## What’s implemented (MVP)
- Auth (register/login) with JWT
- Profile (height/weight/activity level) + TDEE (equilibrium calories)
- Mode phases: cutting / bulking / equilibrium + durations + timeline data
- Training day builder (exercises with sets/reps/weights)
- Workout logging + exercise history
- Progressive overload suggestions (simple heuristic) + line chart (mobile)
- Basic achievements engine (first workout, workout streaks, PR detection)
- Integration stubs for Fitbit / Nutritionix / Stripe (env-gated)
- Backup/restore scripts for MongoDB via Docker

## API endpoints (high level)
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET /profile`, `PUT /profile`
- `GET /modes`, `POST /modes/start`
- `GET /training-days`, `GET /training-days/:id`, `POST /training-days`, `PUT /training-days/:id`, `DELETE /training-days/:id`
- `GET /workouts`, `POST /workouts`, `GET /workouts/exercise/:name/history`, `GET /workouts/achievements`
- `POST /progression/suggest`, `GET /progression/exercise/:name/series`

## Next upgrades (planned)
- Social/community features (friends, feed, comments)
- Push notifications (Expo Notifications) + scheduled reminders
- Paid subscription gating + full Stripe flow in-app
- Exercise video library + predefined plans
- Real integrations (Fitbit OAuth, Nutritionix search, analytics events)

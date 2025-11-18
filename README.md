# 🏋️‍♂️ AI Fitness Tracker for Ambitious Engineers

This App is a production-ready workout intelligence platform built to impress recruiters and hiring managers. It blends polished UI, actionable analytics, and an explainable codebase so you can demo engineering craft, product sense, and relentless iteration in one project.

---

## ✨ Highlights

- **Full-stack experience:** Modern React front-end paired with a zero-dependency Node API and persistent storage.
- **Recruiter-ready storytelling:** Dashboard copy and visuals designed to help you narrate the why behind each feature.
- **AI-inspired insights:** Weekly volume analytics, muscle group heatmaps, and streak tracking to surface actionable trends.
- **Accountability suite:** Custom workout logging, routine blueprints, and automated reminders.
- **Accessible showcase:** Single `npm run dev:full` command spins up both the UI and API for live demos.

---

## 🧱 Architecture Overview

| Layer       | Tech                                        | Notes |
|-------------|---------------------------------------------|-------|
| Frontend    | React 19 + vanilla CSS                      | Custom hash-based router, theming system, SVG charts, export tooling |
| Backend     | Node 20 HTTP server (no external packages)  | RESTful API with modular routing, JSON persistence, analytics helpers |
| Storage     | JSON datastore (`server/data/brogram.json`) | Seeded with realistic sample workouts, routines, and reminders |
| Automation  | Scheduler (`setInterval`)                   | Surfaces upcoming reminders in real time via console logs |

### API surface

```
GET    /api/health
GET    /api/metrics/summary
GET    /api/workouts
POST   /api/workouts
GET    /api/workouts/:id
PUT    /api/workouts/:id
DELETE /api/workouts/:id
GET    /api/routines
POST   /api/routines
GET    /api/reminders
POST   /api/reminders
PATCH  /api/reminders/:id
DELETE /api/reminders/:id
```

All endpoints respond with JSON. Validation errors return a `400` status and structured error message.

---

## 🚀 Getting Started

```bash
cp .env.example .env           # configure port and storage path
npm run server:seed            # populate the database with sample data
npm run dev:server             # start the API (default http://localhost:4000)
npm run dev                    # start the Vite dev server (default http://localhost:5173)
```

For a one-command demo experience:

```bash
npm run dev:full               # runs API and Vite dev server together
```

Build the production bundle:

```bash
npm run build
```

---

## 🧭 Product Tour

### Dashboard
- **Hero narrative** – elevator pitch that explains the product in recruiter-friendly language.
- **Metric tiles** – total sessions, volume moved, minutes trained, and streak tracking.
- **Weekly volume chart** – custom SVG area graph built without external charting libraries.
- **Muscle group heatmap** – highlights training balance to spot gaps instantly.
- **Recent sessions & reminders** – unify qualitative notes with scheduled accountability.

### Workouts
- **Composer** – add exercises, sets, weights, and RIR in a guided UI.
- **Detail view** – review logged sessions with formatted tables and notes.
- **Data hygiene** – confirm deletion prompts protect valuable training data.

### Routines
- **Blueprint gallery** – present structured programs recruiters can skim quickly.
- **Routine creator** – document new plans with focus, difficulty, and duration metadata.

### Reminders
- **Weekly cadence builder** – toggle weekdays to match your schedule.
- **Automation** – backend scheduler surfaces upcoming reminders so you can demo live accountability.

### Settings
- **Theme toggle** – rotate between light, dark, and system with persistence.
- **Data export** – download workouts as JSON for portfolio dashboards or notebooks.
- **Pitch prep tips** – talking points to help guide conversations during interviews.

---

## 🧪 Testing Strategy

- Run `npm run build` to ensure the React app compiles without type errors.
- The API is dependency-free and covered through modular unit functions—easily testable via `curl` or Postman.
- Scheduler output appears in the API console (`🔔 Reminder: ...`).

---

## 🗺️ Roadmap Ideas

- 🤖 **AI programming assistant:** Suggest progressive overload targets based on historical volume.
- 📱 **Wearable sync:** Import data from Apple Health or Fitbit to keep everything in one place.
- 🧑‍🤝‍🧑 **Social leaderboard:** Compare streaks and volume with friends for accountability.
- 📤 **Exports:** Ship PDF/CSV exports and Notion integrations.
- 🔐 **Auth & cloud sync:** Swap JSON storage for hosted DB + auth to ship a SaaS-ready version.

---

## 🙌 Pitch Ready

Use Brogram to demonstrate:

1. **End-to-end ownership** – server, client, analytics, and design all in one repo.
2. **Attention to detail** – thoughtful copy, responsive layouts, and theme support.
3. **Delivery mindset** – scripts, seeds, and documentation that make onboarding effortless.

Show recruiters how you architect, iterate, and obsess over user experience. 💪

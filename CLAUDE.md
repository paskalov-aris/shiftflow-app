# CLAUDE.md — ShiftFlow

## Project Overview

**ShiftFlow** is a cross-platform mobile application for automating operational management of production processes in small and medium-sized enterprises. It covers shift scheduling, team (brigade) management, task assignment and tracking, and basic analytics/reporting.

This is a bachelor's diploma project. The app targets a real gap: existing solutions (MES, ERP, Connecteam, Monday.com, etc.) are either too expensive, too complex, or not tailored for production floor workflows at smaller companies.

## Tech Stack

- **Mobile:** React Native (Expo managed workflow)
- **Backend:** Firebase (serverless / BaaS)
  - **Firestore** — NoSQL document database
  - **Firebase Auth** — authentication (email/password, potentially Google sign-in)
- **Language:** TypeScript
- **Navigation:** React Navigation
- **State management:** React Context + hooks (or Zustand if introduced later)

## Architecture

Serverless architecture built on Firebase. No custom backend server — all server logic lives in Cloud Functions.

### User Roles

There are three roles with different permissions:

| Role | Description |
|------|-------------|
| **Manager** | Full access. Creates shifts, manages teams, assigns tasks, views analytics. |
| **Team Lead (Brigadier)** | Manages their team. Can assign tasks within the team, update shift status, view team analytics. |
| **Worker** | Views their schedule, receives and completes tasks, logs shift activity. |

### Firestore Collections

```
users/
  {userId}
    - email, displayName, role, teamId, createdAt

teams/
  {teamId}
    - name, leaderId, memberIds[], createdAt

shifts/
  {shiftId}
    - teamId, date, startTime, endTime, status, notes, createdBy

tasks/
  {taskId}
    - title, description, assigneeId, teamId, shiftId
    - status (pending | in_progress | done), priority, deadline
    - createdAt, completedAt
```

Collections are flat (no deep nesting). References between documents use ID strings. Queries rely on Firestore indexes.

## Key Screens

1. **OverviewScreen** — role-specific overview (upcoming shift, active tasks count, team status)
2. **ScheduleScreen** — calendar/list view of shifts, create/edit (manager), view (worker)
3. **TasksScreen** — task list with filters (by status, assignee, priority), task detail, create/edit
4. **ManagementScreen** — team members list, team lead assignment, member profiles
5. **ProfileScreen** — user info, role display, logout

## Project Structure

```
src/
├── components/        # Reusable UI components
├── screens/           # Screen components (one per screen)
├── navigation/        # React Navigation config, role-based routing
├── services/          # Firebase service layer (auth, firestore, fcm)
├── hooks/             # Custom hooks (useAuth, useFirestore, useTasks, etc.)
├── context/           # React Context providers (AuthContext, etc.)
├── utils/             # Helpers, constants, formatters
├── types/             # TypeScript type definitions
└── constants/            # Firebase config, environment variables
```

## Firestore Security Rules

Rules must enforce role-based access:
- Workers can only read their own data, their team's shifts, and tasks assigned to them
- Team leads can read/write within their team scope
- Managers have broad read/write access
- All writes must validate required fields
- No unauthenticated access

## Development Guidelines

- Keep components small and focused. Extract reusable UI into `components/`.
- All Firestore operations go through the `services/` layer — screens never call Firestore directly.
- Use TypeScript strictly. Define types for all Firestore documents in `types/`.
- Handle loading and error states in every screen that fetches data.
- Firestore listeners (`onSnapshot`) for real-time data where it matters (active tasks, current shift). One-time fetches (`getDocs`) for historical/analytics data.
- Cloud Functions should be used for: aggregating analytics, sending push notifications on task assignment, and any operation that needs to touch multiple collections atomically.
- Keep the UI clean and production-appropriate — this is a tool for a factory floor, not a consumer social app. Prioritize clarity and speed over visual flair.

## Commands

```bash
# Install dependencies
npm install

# Start dev server
npx run start

# Run on Android
npx run android

# Run on iOS
npx run ios

# Run linter
npm run lint
```

## Testing Strategy

- **Functional testing** of core user flows (login → view shift → complete task → view analytics)
- Test all three roles separately — each should see only what they're allowed to
- Edge cases: empty states, network errors, concurrent edits, role transitions

## Important Notes

- The app name in all UI, notifications, and documentation is **ShiftFlow**.
- Primary language for the UI is Ukrainian.
- This is a diploma project, not a production app. Keep everything as simple as possible. No over-engineering, no premature abstractions, no complex state management unless absolutely necessary. Inline styles are fine. Hardcoded strings are fine. If a feature can be faked with static data or a simple Firestore query instead of a Cloud Function — do that. The goal is a working demo that clearly shows the concept, not a polished product ready for the App Store. Time is the main constraint — cut corners where it doesn't hurt the core functionality.
- The diploma thesis itself is written in Ukrainian. Code and technical docs (like this file) are in English.

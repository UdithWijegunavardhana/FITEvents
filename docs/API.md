# FIT Events — Mock API

Local backend built with **json-server 0.17.x** (pinned: 0.17 supports `_page`, `_limit`, `_sort`, `q`) plus a small custom `server.js` for auth and check-in.

Run: `yarn mock` → `http://localhost:3001`

The data is loaded from `mock-server/db.json` into memory, so changes are lost when the server restarts. `yarn mock:seed` regenerates `db.json` (event dates are relative to today, so re-seed when the list gets old).

Reaching it from devices:
- Android emulator: `adb reverse tcp:3001 tcp:3001`, then use `http://localhost:3001` (or `http://10.0.2.2:3001` without reverse).
- iOS simulator: `http://localhost:3001`.
- Physical phone: laptop's LAN IP, same Wi-Fi.
The base URL comes from `API_BASE_URL` in `.env.*` (S4). Until then it is hardcoded in `src/api/config.ts`.

## Endpoints

### Events
| Method | Path | Notes |
|---|---|---|
| GET | `/events` | Query: `category`, `q` (full-text), `_sort=startsAt`, `_order=asc`, `_page`, `_limit`. Returns `FitEvent[]`; total in `X-Total-Count` header. |
| GET | `/events/:id` | `FitEvent` |

### Auth (custom route in `server.js`)
| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `200 { token, user }` · `401 { message }` |
| GET | `/auth/me` | — (Bearer token) | `User` |

Seed user: `student@fit.uom.lk` / `password123`. Tokens are fake (`fake-jwt-<userId>`); the server only checks the prefix.

### Registrations (Bearer token required)
| Method | Path | Notes |
|---|---|---|
| GET | `/registrations?userId=<id>&_expand=event` | My registrations with event embedded |
| POST | `/registrations` | `{ eventId }` → creates `status: 'registered'`, increments `registeredCount`; `409` if full or already registered |
| PATCH | `/registrations/:id/check-in` | `{ code }` → `status: 'checked_in'`, sets `checkedInAt`; `400` if code wrong |

Each event in `db.json` has a hidden `checkInCode` (stripped from `/events` responses by `server.js`). Print QR codes with `yarn mock:qr <eventId>` (generates a PNG under `mock-server/qr/`). The QR encodes `fitevents://check-in?eventId=<id>&code=<checkInCode>`.

## Errors
All errors: `{ "message": string }` with a suitable status code. `server.js` supports `?_delay=2000` (milliseconds, max 30000) to demo loading states, and `?_fail=1` to force a 500 for error-state demos. Both work on every route.

## Seed data
`mock-server/seed.js` generates ≥ 20 events across all categories, spread over the next 8 weeks, with realistic FIT venues (e.g. "Lecture Hall 1", "Computer Lab 3", "Auditorium") and images from a royalty-free placeholder source.

# FIT Events — Session Roadmap

Each session ends with a tag. Build only what the current session lists. "Checkpoints" are commit-sized steps that double as live-demo stops.

---

## S0 — Project setup (before Session 1, done by the lecturer)
- RN 0.87.1 TypeScript project, runs on Android emulator and iOS simulator.
- `src/` structure from CLAUDE.md, path alias `@/` → `src/`.
- ESLint + Prettier, `yarn typecheck`, husky + lint-staged pre-commit.
- `src/theme` (colors light/dark, spacing, typography, radius).
- README with setup steps for Windows/macOS students.
- Tag: `s0-setup`

## S1 — Foundations: first screens
Checkpoints:
1. Static `EventCard` component (image, category tag, title, date · venue) with hardcoded data.
2. `HomeScreen` rendering 5 hardcoded events with `ScrollView`, Flexbox layout.
3. `EventDetailScreen` (static) — not navigable yet, rendered by temporarily switching `App.tsx`.
4. Shared `Tag` and `Button` atoms.
- Lab: students build the detail screen from a screenshot.
- Tag: `s1-end`

## S2 — Components, structure, navigation
Checkpoints:
1. Refactor into `features/events/{screens,components}`; atoms in `src/components`.
2. Bottom tabs (Home, Bookmarks, Profile) + Home stack (Home → EventDetail) with typed params.
3. `FlatList` with mock data from `features/events/mockEvents.ts`, `keyExtractor`, empty state.
4. Category filter chips + search input (local filtering).
5. Accessibility pass (roles, labels, hit slop), `Platform.select` example.
- Tag: `s2-end`

## S3 — State and data
Checkpoints:
1. `mock-server/` with json-server + `db.json` (≥ 20 events), `yarn mock`.
2. Redux store; RTK Query `eventsApi` (`getEvents`, `getEventById`) replacing mock data.
3. Loading / error-with-retry / empty states; pull-to-refresh.
4. `bookmarks` slice; persist to MMKV (Redux-Saga); Bookmarks tab works offline.
5. Small `ThemeContext` (light/dark toggle) to contrast Context vs Redux.
- Branch `s3-saga-demo`: the same "load events" flow implemented with Redux-Saga for comparison. Not merged.
- Tag: `s3-end`

## S4 — Native, device, environments, security
Built on branch `s4-native` (auth was done earlier, on branch `s4`).

Checkpoints:
1. Environments: react-native-config, `.env.dev|staging|prod` (+ `.env.example`), Android flavors `dev|staging|prod`, iOS schemes `FITEvents-Dev|Staging|Prod`. App name and ID suffix per env. `yarn android:<env>` / `yarn ios:<env>`.
2. Auth (done earlier, on branch `s4`): DummyJSON sign in (`emilys` / `emilyspass`), RTK Query login mutation driven by a Redux-Saga flow, AuthStack, tokens in Keychain, logout.
3. Deep link `fitevents://event/<id>` opens Event Detail through React Navigation `linking`, from cold start and while running. When signed out, the link is kept and opened after login.
4. QR scanner tab (react-native-camera-kit + react-native-permissions): granted / denied / blocked → open Settings. Scanned `fitevents://event/<id>` links reuse the deep link config (`useLinkTo`). `yarn mock:qr <eventId>` prints the QR code.
5. Local reminder (react-native-notify-kit): a bookmarked event can schedule a notification 30 min before it starts (inexact alarm on Android). Tapping it opens the event through the deep link handling. Removing the bookmark cancels the reminder.
6. patch-package demo: one documented patch in `patches/` (react-native-permissions → `BaseReactPackage`), applied by `postinstall`.
- Dropped from the original plan: registrations (`POST /registrations`, My Registrations) and check-in against a registration.
- Lab: a Share button on Event Detail that shares `fitevents://event/<id>`, including an unknown event id.
- Tag: `s4-end`

## S5 — Quality: testing, performance, memory
Checkpoints:
1. Jest unit tests: date formatting utils, bookmarks slice, filter logic.
2. RNTL tests: `EventCard`, `HomeScreen` (mocked API states), Sign In form.
3. Maestro flow: sign in → open event → bookmark → verify in Bookmarks tab.
4. Performance: profile Home with React Native DevTools; switch to FlashList; memoisation where the profiler shows it matters.
5. Branch `s5-leak-demo`: `LiveUpdatesScreen` with an uncleared interval, listener and module-level cache (intentionally leaky) + full-res image list. Fix on the same branch in a follow-up commit so before/after can be compared.
- Tag: `s5-end`

## S6 — Shipping
Checkpoints:
1. App icons + splash per environment; version/build number strategy.
2. Android release signing (keystore outside repo), `bundleProdRelease` AAB.
3. iOS archive config for the prod scheme.
4. GitHub Actions: lint, typecheck, test on every PR; Android release build on tag.
5. Fastlane lanes: `android beta` (Play internal track), `ios beta` (TestFlight).
6. Crash reporting (Sentry or Crashlytics) with a test crash.
- Tag: `s6-end`

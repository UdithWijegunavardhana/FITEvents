# FIT Events — Claude Code guide

FIT Events is a faculty events app for the University of Moratuwa, Faculty of IT. It is built **live, session by session** in a 6-session React Native lecture series for 3rd-year students. The code is teaching material first and a product second.

Read before working: `docs/PROJECT_BRIEF.md` (what the app is), `docs/ROADMAP.md` (what belongs in which session), `docs/API.md` (backend contract).

## Stack (bare React Native CLI)

- React Native **0.87.1**, TypeScript, New Architecture (only option), Hermes
- Navigation: React Navigation 7 (native-stack + bottom-tabs)
- State: Redux Toolkit + RTK Query (events, server state) · RTK Query for all HTTP · Redux-Saga for auth and bookmarks orchestration, TechCart-style (`api/ redux/ saga/` per feature)
- Storage: react-native-mmkv (app data) · react-native-keychain (tokens)
- Env: react-native-config with Android flavors / iOS schemes (`dev`, `staging`, `prod`)
- Testing: Jest + React Native Testing Library · Maestro for E2E
- Mock backend: json-server (`mock-server/`) for events · DummyJSON (`https://dummyjson.com`) for auth

Before adding **any** dependency: confirm on npm/GitHub that the current stable release supports React Native 0.87 and the New Architecture, pick a version published at least 14 days ago, pin it exactly, and tell me what you chose and why. If a library is not compatible, stop and propose alternatives.

## Folder structure

```
src/
  app/            App.tsx and root providers
  api/            baseApi.ts (RTK Query base, config.ts)
  redux/          store.ts, rootReducer.ts, rootSaga.ts, hooks.ts
  contexts/       React contexts (ThemeContext, AuthContext)
  navigation/     AppNavigator, BottomTabNavigator, stackNavigators/ (HomeStack, AuthStack), routes.ts, types.ts
  features/
    <feature>/    api/ redux/ saga/ screens/ components/ utils/ constants.ts types.ts
  components/     shared UI (atoms/molecules)
  services/       secureStorage.ts (Keychain tokens); notifications later in S4
  theme/          colors, spacing, typography
  utils/          storage.ts (MMKV instance) and other helpers
mock-server/      db.json, routes, seed script
e2e/              Maestro flows
```

Features: `events` (list and detail), `bookmarks`, `auth`, `profile`, `checkIn`. Layout follows the TechCart reference app: per feature `api/` (RTK Query `*.api.ts` endpoints, `*.api.types.ts`), `redux/` (slice, selectors), `saga/` (`*SagaActions.ts`, `*Saga.ts`), `screens/`, `components/`. All HTTP goes through RTK Query; `auth` and `bookmarks` add a saga flow for orchestration and persistence.

## Coding rules (teaching code)

- Readable over clever. No abstraction until something is used twice.
- Functional components + hooks. Named exports for components; one component per file.
- Strict TypeScript. No `any` (use `unknown` + narrowing). Typed navigation params.
- Styles: `StyleSheet.create` at the bottom of the file; values from `src/theme`. No inline styles except truly dynamic values.
- User-facing strings in the feature's `constants.ts`.
- No code comments in JS/TS source or config. Explanations belong in the lecture, commit messages and `docs/`.
- Every touchable has `accessibilityRole` and a label; every element used in tests has a `testID`.
- Handle loading, error (with retry) and empty states on every data screen.

## Session discipline

- Only build what `docs/ROADMAP.md` lists for the current session. Do not build ahead.
- Work in small steps. Each step = one commit, message `s<N>: <what>` (e.g. `s2: add bottom tab navigator`). These commits are the live-demo checkpoints.
- End of session: everything green, then tag `s<N>-end`.
- Never rewrite history on `main` or move existing tags. (One approved exception, 2026-11-21: commit author and co-author trailers were rewritten before the first public use.)

## Commands

Yarn 4 (via Corepack, `nodeLinker: node-modules`), Node 22 (`.nvmrc`). `.yarnrc.yml` sets a 14-day `npmMinimalAgeGate`, so installs only pick versions at least 14 days old.

- `yarn start` · `yarn android` · `yarn ios` (both run the dev env) · `yarn android:<env>` / `yarn ios:<env>` for `dev`, `staging`, `prod` (needs `.env.<env>`, copy `.env.example`)
- `yarn lint` · `yarn typecheck` · `yarn test`
- `yarn mock` (json-server on port 3001) · `yarn mock:seed` (regenerate `mock-server/db.json`) · `yarn mock:qr <eventId>` (event deep-link QR PNG) · `yarn e2e` (Maestro; added in S5)
- iOS native deps (macOS, after adding any native module): `cd ios && bundle exec pod install`

Before every commit: `yarn lint && yarn typecheck && yarn test`. The husky pre-commit hook runs lint-staged (eslint --fix + prettier) and `yarn typecheck`.

The `@/` alias (→ `src/`) is defined in three places that must stay in sync: `babel.config.js`, `tsconfig.json` (`paths`), and `jest.config.js` (`moduleNameMapper`).

The app name `FITEvents` (`app.json`) must match `ios/FITEvents/AppDelegate.swift` and `android/app/src/main/java/com/fitevents/MainActivity.kt`. Change all three together.

## Never

- Commit `.env*` (only `.env.example`), keystores, API keys, Firebase config files with real projects.
- Store tokens in MMKV/AsyncStorage (use Keychain).
- Disable lint rules or TypeScript checks to make something pass.
- Silently change the plan — ask first.

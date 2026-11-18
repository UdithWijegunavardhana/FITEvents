# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

FITEvents is a freshly bootstrapped React Native CLI app (not Expo) — React Native 0.87.1, React 19.2, TypeScript. `App.tsx` still renders the template `NewAppScreen`; no app features, navigation, state management, or styling library exist yet. Node >= 22.11 is required.

## Commands

```sh
npm start                    # Metro bundler (run first, in its own terminal)
npm run ios                  # build + run on iOS simulator
npm run android              # build + run on Android emulator/device
npm run lint                 # eslint . (@react-native config)
npm test                     # jest (@react-native/jest-preset)
npx jest __tests__/App.test.tsx   # single test file
npx jest -t "renders correctly"   # single test by name
npx tsc --noEmit             # type-check (no script defined for this)
```

iOS native deps (first clone, and after adding/updating any native module):

```sh
bundle install               # once, installs CocoaPods via Gemfile
cd ios && bundle exec pod install
```

## Architecture

- Entry: `index.js` registers `App` under the name from `app.json` (`FITEvents`). That name must match the native module name in `ios/FITEvents/AppDelegate.swift` and `android/app/src/main/java/com/fitevents/MainActivity.kt` — change all three together.
- `App.tsx` wraps the tree in `SafeAreaProvider` (react-native-safe-area-context); read insets via `useSafeAreaInsets()` below it.
- New Architecture and Hermes are enabled (`android/gradle.properties`: `newArchEnabled=true`, `hermesEnabled=true`). Any native library added must support the New Architecture.
- Android package / bundle namespace: `com.fitevents`.
- Tests use `react-test-renderer` with `act()`; native modules not covered by the jest preset will need mocks.

## Conventions

- Prettier: single quotes, trailing commas everywhere, `arrowParens: 'avoid'` (prettier 2.8.8).
- ESLint extends `@react-native`; TS config extends `@react-native/typescript-config`.

# FIT Events — Claude Code guide

FIT Events is a faculty events app for the University of Moratuwa, Faculty of IT. It is built **live, session by session** in a 6-session React Native lecture series for 3rd-year students. The code is teaching material first and a product second.

Read before working: `docs/PROJECT_BRIEF.md` (what the app is), `docs/ROADMAP.md` (what belongs in which session), `docs/API.md` (backend contract).

## Stack (bare React Native CLI)

- React Native **0.87.1**, TypeScript, New Architecture (only option), Hermes
- Navigation: React Navigation 7 (native-stack + bottom-tabs)
- State: Redux Toolkit + RTK Query (server state); one Redux-Saga flow on a demo branch
- Storage: react-native-mmkv (app data) · react-native-keychain (tokens)
- Env: react-native-config with Android flavors / iOS schemes (`dev`, `staging`, `prod`)
- Testing: Jest + React Native Testing Library · Maestro for E2E
- Mock backend: json-server (`mock-server/`)

Before adding **any** dependency: confirm on npm/GitHub that the current stable release supports React Native 0.87 and the New Architecture, pick a version published at least 14 days ago, pin it exactly, and tell me what you chose and why. If a library is not compatible, stop and propose alternatives.

## Folder structure

```
src/
  app/            App.tsx, providers, store setup
  navigation/     navigators + typed param lists
  features/
    <feature>/    screens/ components/ api/ store/ hooks/ utils/ constants.ts types.ts
  components/     shared UI (atoms/molecules)
  services/       api base (RTK Query), storage, secure storage, notifications
  theme/          colors, spacing, typography
  utils/
mock-server/      db.json, routes, seed script
e2e/              Maestro flows
```

Features: `events`, `eventDetail`, `bookmarks`, `auth`, `profile`, `checkIn`.

## Coding rules (teaching code)

- Readable over clever. No abstraction until something is used twice.
- Functional components + hooks. Named exports for components; one component per file.
- Strict TypeScript. No `any` (use `unknown` + narrowing). Typed navigation params.
- Styles: `StyleSheet.create` at the bottom of the file; values from `src/theme`. No inline styles except truly dynamic values.
- User-facing strings in the feature's `constants.ts`.
- Comments explain **why**, not what. Add a short header comment to files that introduce a new concept (e.g. "RTK Query: caches server data and tracks loading/error for us").
- Every touchable has `accessibilityRole` and a label; every element used in tests has a `testID`.
- Handle loading, error (with retry) and empty states on every data screen.

## Session discipline

- Only build what `docs/ROADMAP.md` lists for the current session. Do not build ahead.
- Work in small steps. Each step = one commit, message `s<N>: <what>` (e.g. `s2: add bottom tab navigator`). These commits are the live-demo checkpoints.
- End of session: everything green, then tag `s<N>-end`.
- Never rewrite history on `main` or move existing tags.

## Commands

- `yarn start` · `yarn android:dev` · `yarn ios:dev`
- `yarn mock` (json-server on port 3001)
- `yarn lint` · `yarn typecheck` · `yarn test` · `yarn e2e`

Before every commit: `yarn lint && yarn typecheck && yarn test`.

## Never

- Commit `.env*` (only `.env.example`), keystores, API keys, Firebase config files with real projects.
- Store tokens in MMKV/AsyncStorage (use Keychain).
- Disable lint rules or TypeScript checks to make something pass.
- Silently change the plan — ask first.

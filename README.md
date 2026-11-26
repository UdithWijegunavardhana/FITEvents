# FIT Events

A faculty events app for the Faculty of IT, University of Moratuwa, built live across a 6-session React Native lecture series.

- What the app is: [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md)
- What gets built in each session: [docs/ROADMAP.md](docs/ROADMAP.md)
- Mock backend contract: [docs/API.md](docs/API.md)

Stack: React Native 0.87 (bare CLI, TypeScript, New Architecture, Hermes), Yarn 4.

## Setup

**Android is required** for the labs, on Windows or macOS. **iOS is optional** and needs a Mac with Xcode.

### 1. Common (Windows and macOS)

1. **Git**: <https://git-scm.com/downloads>. On Windows this also installs Git Bash, which runs the pre-commit hook.
2. **Node.js 22 LTS**. Use a version manager so you can switch versions later:
   - macOS: [nvm](https://github.com/nvm-sh/nvm), then `nvm install` inside the project (it reads `.nvmrc`).
   - Windows: [nvm-windows](https://github.com/coreybutler/nvm-windows), then `nvm install 22` and `nvm use 22`.
3. **Yarn 4 via Corepack** (bundled with Node 22). The project pins its Yarn version in `package.json`:
   ```sh
   corepack enable        # Windows: run in a terminal opened "as Administrator"
   yarn --version         # should print 4.10.3 inside the project folder
   ```

### 2. Android (required)

1. **JDK 17**: [Azul Zulu 17](https://www.azul.com/downloads/?version=java-17-lts&package=jdk) (macOS: `brew install --cask zulu@17`). Set `JAVA_HOME` to its install folder.
2. **Android Studio**: <https://developer.android.com/studio>. In *Settings → Languages & Frameworks → Android SDK*:
   - *SDK Platforms*: **Android 16 (API 36)** and **API 37**.
   - *SDK Tools*: **Android SDK Build-Tools 37**, **Android SDK Command-line Tools**, **Android Emulator**, **Android SDK Platform-Tools**.
3. **Environment variables**:
   - macOS (`~/.zshrc`):
     ```sh
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
     ```
   - Windows (*System Properties → Environment Variables*): add `ANDROID_HOME` = `%LOCALAPPDATA%\Android\Sdk`, and add `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\emulator` to `Path`.
4. **Emulator**: Android Studio → *Device Manager* → create a Pixel device with a recent system image (x86_64 on Intel/AMD, arm64 on Apple Silicon).

**Windows notes**
- Clone into a **short path without spaces**, e.g. `C:\dev\FITEvents`. Long paths break the native (CMake) build.
- Enable hardware virtualisation in BIOS if the emulator refuses to start.

### 3. iOS (optional, macOS only)

1. **Xcode** from the App Store, then open it once to install the iOS simulator and command-line tools.
2. **Ruby + CocoaPods**: the project's `Gemfile` pins CocoaPods. From the project root:
   ```sh
   bundle install
   cd ios && bundle exec pod install && cd ..
   ```
   Re-run `pod install` whenever a native library is added.

## Run the app

```sh
git clone <repo-url> FITEvents
cd FITEvents
yarn install          # also sets up the git pre-commit hook
cp .env.example .env.dev   # from S4; see "Environments" below

yarn start            # Metro bundler; keep this terminal open
yarn android          # second terminal: build + launch on the emulator (dev)
yarn ios              # macOS only (dev)
```

The first Android build takes several minutes. Later builds are much faster.

### Mock API (from S3)

The app loads events from a local mock server. Start it in its own terminal and keep it running:

```sh
yarn mock             # http://localhost:3001
adb reverse tcp:3001 tcp:3001   # Android emulator only, once per emulator start
```

iOS simulators reach it at `localhost` directly. See [docs/API.md](docs/API.md) for the endpoints, and for `?_delay=` and `?_fail=1`, which help demo loading and error states.

### Environments (from S4)

There are four environments: `dev`, `qa`, `uat` and `prod`. Each reads its settings from its own env file through [react-native-config](https://github.com/react-native-config/react-native-config):

| Env | Env file | App name | Bundle / application ID | Android | iOS |
|---|---|---|---|---|---|
| dev | `.env.dev` | FIT Events Dev | `com.fitevents.dev` | `yarn android:dev` | `yarn ios:dev` |
| qa | `.env.qa` | FIT Events QA | `com.fitevents.qa` | `yarn android:qa` | `yarn ios:qa` |
| uat | `.env.uat` | FIT Events UAT | `com.fitevents.uat` | `yarn android:uat` | `yarn ios:uat` |
| prod | `.env.prod` | FIT Events | `com.fitevents` | `yarn android:prod` | `yarn ios:prod` |

- Only `.env.example` is committed. Copy it to the env files you need and fill in the values.
- `yarn android` and `yarn ios` run the dev environment.
- Each environment installs as a separate app, so all four can sit on one device side by side. Prod has no ID suffix.
- Env values are compiled into the native build. After you change an env file, rebuild the app; reloading Metro is not enough.
- Android uses the `dev`, `qa`, `uat` and `prod` product flavors.
- iOS uses the `FITEvents-Dev`, `FITEvents-QA`, `FITEvents-UAT` and `FITEvents-Prod` schemes, with matching `Debug-<Env>` / `Release-<Env>` build configurations.

### Deep links (from S4)

`fitevents://event/<id>` opens Event Detail. If you are signed out, the app keeps the link and opens it after you sign in. To try it:

```sh
xcrun simctl openurl booted fitevents://event/evt-001                                          # iOS simulator
adb shell am start -W -a android.intent.action.VIEW -d fitevents://event/evt-001 com.fitevents.dev   # Android (dev)
```

The **Scan** tab reads QR codes with the camera and opens `fitevents://event/<id>` links the same way. Print one with `yarn mock:qr evt-001`. The iOS simulator has no camera, so test scanning on a real device.

All three environments register the same `fitevents` scheme. If more than one is installed, the OS picks which app opens the link.

### Event reminders (from S4)

On Event Detail, a bookmarked event has a **Remind me 30 min before** button. It schedules a local notification with [react-native-notify-kit](https://github.com/marcocrupi/react-native-notify-kit), and tapping the notification opens the event through the `fitevents://event/<id>` deep link. Removing the bookmark cancels the reminder.

- **Not exact:** on Android the reminder uses an inexact alarm, so it can arrive a few minutes late. The app does not request the exact-alarm permission.
- **Push notifications** are out of scope.
- **Quick test:** an event must start more than 30 minutes from now. To see a reminder within a minute, change an event's `startsAt` on the running mock server (`PATCH /events/<id>`). Restart `yarn mock` to reset it.

## Everyday commands

| Command | What it does |
|---|---|
| `yarn lint` | ESLint (`@react-native` config) |
| `yarn typecheck` | TypeScript, no output files |
| `yarn test` | Jest |
| `yarn mock` | Mock API on port 3001 |
| `yarn mock:seed` | Regenerate `mock-server/db.json` |
| `yarn postinstall` | Re-apply dependency patches from `patches/` (see [patches/README.md](patches/README.md)) |
| `yarn mock:qr <eventId>` | QR code PNG with `fitevents://event/<id>` for the Scan tab (`mock-server/qr/`) |

Run `yarn lint && yarn typecheck && yarn test` before every commit. The pre-commit hook also auto-formats staged files and blocks the commit on type errors.

## Sign in (demo account)

Auth uses [DummyJSON](https://dummyjson.com/docs/auth), so it needs internet and no local server. Sign in with `emilys` / `emilyspass`. Tokens are stored in the Keychain (iOS) or Keystore-backed storage (Android); the user profile is stored in MMKV.

## Project layout

```
src/
  app/          App.tsx and root providers
  api/          RTK Query base API and config
  redux/        store, root reducer, root saga, typed hooks
  contexts/     React contexts (theme, auth)
  navigation/   AppNavigator, tabs, stacks (home, auth), typed params
  features/     one folder per feature: api/ redux/ saga/ screens/ components/
  components/   shared UI
  services/     secure storage (Keychain)
  theme/        colours (light/dark), spacing, typography, radius
  utils/        storage (MMKV) and helpers
```

Import from `src` with the `@/` alias, e.g. `import { spacing } from '@/theme';`.

## Troubleshooting

- **`yarn` prints 1.x**: run `corepack enable` again, then open a new terminal.
- **Android build cannot find the SDK**: check `ANDROID_HOME`, or create `android/local.properties` with `sdk.dir=<path to SDK>`.
- **Stale Metro cache** after switching branches: `yarn start --reset-cache`.
- **Android build is broken after switching branches**: `cd android && ./gradlew clean` (Windows: `gradlew clean`).

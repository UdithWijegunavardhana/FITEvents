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

yarn start            # Metro bundler; keep this terminal open
yarn android          # second terminal: build + launch on the emulator
yarn ios              # macOS only
```

The first Android build takes several minutes. Later builds are much faster.

### Mock API (from S3)

The app loads events from a local mock server. Start it in its own terminal and keep it running:

```sh
yarn mock             # http://localhost:3001
adb reverse tcp:3001 tcp:3001   # Android emulator only, once per emulator start
```

iOS simulators reach it at `localhost` directly. See [docs/API.md](docs/API.md) for the endpoints, and for `?_delay=` and `?_fail=1`, which help demo loading and error states.

## Everyday commands

| Command | What it does |
|---|---|
| `yarn lint` | ESLint (`@react-native` config) |
| `yarn typecheck` | TypeScript, no output files |
| `yarn test` | Jest |
| `yarn mock` | Mock API on port 3001 |
| `yarn mock:seed` | Regenerate `mock-server/db.json` |
| `yarn mock:qr <eventId>` | QR code PNG for check-in (`mock-server/qr/`) |

Run `yarn lint && yarn typecheck && yarn test` before every commit. The pre-commit hook also auto-formats staged files and blocks the commit on type errors.

## Project layout

```
src/
  app/          App.tsx and root providers
  api/          RTK Query base API and config
  redux/        store, root reducer, typed hooks
  contexts/     React contexts (theme)
  navigation/   AppNavigator, tabs, stacks, typed params
  features/     one folder per feature: api/ redux/ screens/ components/
  components/   shared UI
  services/     secure storage, notifications (S4)
  theme/        colours (light/dark), spacing, typography, radius
  utils/        storage (MMKV) and helpers
```

Import from `src` with the `@/` alias, e.g. `import { spacing } from '@/theme';`.

## Troubleshooting

- **`yarn` prints 1.x**: run `corepack enable` again, then open a new terminal.
- **Android build cannot find the SDK**: check `ANDROID_HOME`, or create `android/local.properties` with `sdk.dir=<path to SDK>`.
- **Stale Metro cache** after switching branches: `yarn start --reset-cache`.
- **Android build is broken after switching branches**: `cd android && ./gradlew clean` (Windows: `gradlew clean`).

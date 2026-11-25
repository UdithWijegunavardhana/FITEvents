# Patches

Small fixes to dependencies in `node_modules`, applied with [patch-package](https://github.com/ds300/patch-package) (8.0.1).

## How they are applied

`postinstall` runs `husky && patch-package`, so every install from a clean checkout applies all patches.

Yarn 4 runs `postinstall` only when the dependency tree changes. If you pull a new or changed patch without any dependency change, apply it yourself:

```sh
yarn postinstall
```

## Creating or updating a patch

1. Edit the file under `node_modules/<package>/`.
2. Create the patch file: `patches/<package>+<exact version>.patch`, with paths starting `a/node_modules/<package>/` and `b/node_modules/<package>/`.
   - `npx patch-package <package>` does this on npm/Yarn 1 projects.
   - With Yarn 4 it fails, because it installs a clean copy using Yarn 1 options. Use `git diff --no-index` between a clean copy (`npm pack <package>@<version>`) and your edited file instead.
3. Delete `node_modules/<package>`, run `yarn postinstall`, and check that `patch-package` reports `✔` for the package.
4. Add an entry below.

The file name includes the exact version. When the package is upgraded, `patch-package` fails loudly; at that point either delete the patch (fixed upstream) or recreate it for the new version.

## Current patches

### react-native-permissions@5.6.3

- **File:** `android/src/main/java/com/zoontek/rnpermissions/RNPermissionsPackage.kt`
- **Problem:** the Android package class extends `com.facebook.react.TurboReactPackage`. React Native 0.87 marks it deprecated ("Use BaseReactPackage instead"), and every Android build prints a deprecation warning for it. Once React Native removes the class, the library stops compiling.
- **Fix:** extend `com.facebook.react.BaseReactPackage` instead. In React Native 0.87, `TurboReactPackage` is an empty subclass of `BaseReactPackage`, so behaviour is unchanged.
- **Upstream:** still present in 5.7.0 (2026-11-23).
- **Remove when:** a release that extends `BaseReactPackage` is out and passes the 14-day age gate.

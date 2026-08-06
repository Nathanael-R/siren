# ADR 001: version baseline

**Status:** Accepted on 2026-08-06

## Decision

The playground targets Expo SDK 57 and supports SDK 56 as the previous stable compatibility line. SDK 57 resolves React 19.2.3 and React Native 0.86.2; SDK 56 resolves React 19.2 and React Native 0.85. Siren supports the New Architecture only.

The SDK 57 playground uses Expo's bundled versions: `expo-audio ~57.0.3`, Reanimated `4.5.1`, Worklets `0.10.1`, Gesture Handler `~2.32.0`, and Skia `2.6.2`. Native packages are installed with `expo install` or pinned to the SDK bundle. Reanimated and Worklets must remain a compatible pair. SDK 56 consumers should use the versions selected by `expo install` in their app rather than copying the SDK 57 pins.

Node 22.13 or newer and pnpm 11.16 are the workspace baseline. pnpm's isolated layout remains enabled; Expo has supported isolated installs since SDK 54. Changesets is retained because it understands multi-package dependency versioning and works with pnpm workspaces.

## Compatibility and limitations

- SDK 57 raises the native baseline to iOS 16.4, Android 7/API 24, Android compile/target API 36, and Xcode 26.4.
- Reanimated 4 is New Architecture only and requires the matching `react-native-worklets` native and Babel implementation.
- `expo-audio` provides recording, playback, metering, permissions, interruption events, and resource lifecycle. It does not provide a first-party offline waveform extractor, so Siren retains the pluggable `WaveformExtractor` interface.
- Recordings begin in the cache directory by default. Ownership transfers to the application after successful completion.
- Background recording remains experimental and is not enabled in the playground.
- Expo Go can load these bundled packages, but production verification targets development builds.
- Skia stays an optional peer and is used only by the visualizer path; waveform defaults use bounded native views until physical-device measurements justify a renderer change.

## Sources

- [Expo SDK reference](https://docs.expo.dev/versions/latest/)
- [Expo SDK 57 bundled native modules](https://github.com/expo/expo/blob/sdk-57/packages/expo/bundledNativeModules.json)
- [Expo audio](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Expo monorepos](https://docs.expo.dev/guides/monorepos/)
- [Reanimated compatibility](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/)
- [Expo unit testing](https://docs.expo.dev/develop/unit-testing/)
- [Expo Maestro workflows](https://docs.expo.dev/eas/workflows/examples/e2e-tests/)
- [Expo Modules API](https://docs.expo.dev/modules/overview/)
- [Changesets](https://github.com/changesets/changesets)

## Validation commands

```sh
pnpm install --frozen-lockfile
pnpm --filter @siren-ui/playground exec expo install --check
pnpm --filter @siren-ui/playground exec expo-doctor
pnpm check:duplicates
pnpm check:deps
```

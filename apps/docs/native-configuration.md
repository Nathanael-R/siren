# Native configuration

Install native dependencies with `npx expo install`. Wrap the root and modal content with `GestureHandlerRootView`. Configure the `expo-audio` plugin with application-owned microphone permission copy, then rebuild the development client. Background recording is experimental and disabled by default.

The CLI prints these requirements but does not edit `app.json`, native manifests, Babel configuration, permission text, or build properties.

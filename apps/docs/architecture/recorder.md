# Recorder architecture

The framework-independent `RecorderController` owns transitions, timing, limits, and typed errors. `useExpoVoiceRecorder` synchronizes permissions and Expo Audio resources. Exported primitives own presentation and composed blocks reuse them.

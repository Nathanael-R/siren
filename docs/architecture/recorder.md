# Recorder architecture

`RecorderController` owns valid state transitions, accumulated millisecond timing, minimum/maximum duration, typed errors, interruption state, and completed recording metadata without React or Expo. `useExpoVoiceRecorder` owns permission checks, `expo-audio` setup/disposal, metering conversion, and controller subscription. Visual components remain controlled.

Permission requests are explicit by default. Cancelled temporary files remain managed by the audio engine; completed results become application-owned. Partial URIs are surfaced after interruptions and never silently deleted.

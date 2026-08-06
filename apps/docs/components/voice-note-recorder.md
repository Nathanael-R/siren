# VoiceNoteRecorder

`siren-ui add voice-note-recorder` resolves all recorder primitives plus the Expo hook. iOS/Android supported; web experimental; Expo Go may run bundled APIs, but release verification requires a development build. Configure microphone permission copy.

```tsx
<VoiceNoteRecorder
  minimumDurationMs={500}
  maximumDurationMs={60_000}
  onComplete={(recording) => saveLocally(recording)}
/>
```

Ready, permission, recording, locked, paused, processing, preview, retry, typed errors, limits, cancellation, interruption, and partial URI recovery are modeled. The result is application-owned; Siren does not upload or persist it.

<!--@include: ./_shared.md-->

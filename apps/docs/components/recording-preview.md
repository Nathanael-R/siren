# RecordingPreview

`siren-ui add recording-preview` resolves VoiceNotePlayer. iOS/Android supported; web experimental; Expo Go supported; no extra native configuration.

```tsx
<RecordingPreview
  recording={recording}
  onDiscard={discard}
  onConfirm={useRecording}
/>
```

Playback, speed, scrubbing, duration, loading, error, discard, and confirmation states are included.
For fixture or asset-backed previews, `source` can override the recording URI while preserving the recording returned by `onConfirm`.

<!--@include: ./_shared.md-->

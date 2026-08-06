# RecordingTimer

`siren-ui add recording-timer` copies one component. Dependency: core. iOS/Android supported; web experimental; Expo Go supported; no native configuration.

```tsx
<RecordingTimer
  durationMs={elapsedMs}
  state="recording"
  warningThresholdMs={55_000}
  maximumDurationMs={60_000}
/>
```

Millisecond input, tabular formatting, warning state, maximum display, paused/processing labels, and polite announcements are supported.

<!--@include: ./_shared.md-->

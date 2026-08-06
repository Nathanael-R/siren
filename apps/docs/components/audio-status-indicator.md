# AudioStatusIndicator

`siren-ui add audio-status-indicator` copies a dependency-free neutral component. iOS/Android supported; web experimental; Expo Go supported.

```tsx
<AudioStatusIndicator
  status="recovering"
  label="Restoring microphone"
  icon={<RouteIcon />}
/>
```

Loading, buffering, ready, playing, paused, recording, interrupted, route-changed, recovering, and error states have accessible labels and stable slots.

<!--@include: ./_shared.md-->

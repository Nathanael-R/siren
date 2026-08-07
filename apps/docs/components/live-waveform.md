# LiveWaveform

`siren-ui add live-waveform` copies the component and Expo metering adapter hook. Dependencies: core and Reanimated/Worklets. iOS/Android supported; web experimental; Expo Go supported; no custom config beyond SDK-compatible Reanimated.

```tsx
<LiveWaveform sample={level} historySize={48} paused={paused} />
```

API: controlled normalized `sample`, bounded history, direction, pause, reduced motion, color, height, and label. The fixed bars interpolate through shared values instead of snapping and do not use React state per sample. Reduced Motion keeps the data legible but removes interpolation.

<!--@include: ./_shared.md-->

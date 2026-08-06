# WaveformScrubber

`siren-ui add waveform-scrubber` copies the scrubber and Waveform. Dependencies: core and Gesture Handler. iOS/Android supported; web experimental; Expo Go supported. Wrap roots with `GestureHandlerRootView`.

```tsx
<WaveformScrubber
  samples={samples}
  positionMs={positionMs}
  durationMs={durationMs}
  onSeek={seek}
  onSeekPreview={preview}
/>
```

Drag and tap seek; preview callbacks are throttled; final seek is distinct. Accessibility actions seek in five-percent/one-second steps and RTL reverses geometry.

<!--@include: ./_shared.md-->

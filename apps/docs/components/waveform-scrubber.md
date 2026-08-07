# WaveformScrubber

`siren-ui add waveform-scrubber` copies the scrubber and Waveform. Dependencies: core, Gesture Handler, and Reanimated/Worklets. iOS/Android supported; web experimental; Expo Go supported. Wrap roots with `GestureHandlerRootView`.

```tsx
<WaveformScrubber
  samples={samples}
  positionMs={positionMs}
  durationMs={durationMs}
  onSeek={seek}
  onSeekPreview={preview}
/>
```

Drag and tap seek with a UI-thread playhead; React does not rerender for every drag frame. Preview callbacks are throttled while the final seek remains distinct. Accessibility actions seek in five-percent/one-second steps and RTL reverses geometry.

<!--@include: ./_shared.md-->

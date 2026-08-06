# AgentVisualizer

`siren-ui add agent-visualizer` copies one behavior-led component. Dependencies: core and Reanimated/Worklets. iOS/Android supported; web experimental; Expo Go supported.

```tsx
<AgentVisualizer
  state="speaking"
  outputLevel={level}
  variant="radial-bars"
  lowPerformanceMode={slowDevice}
/>
```

Orb, waveform-field, and radial-bars variants share idle/listening/thinking/speaking state and normalized input/output levels. Raw PCM is not accepted. Reduced-motion and low-performance modes degrade gracefully.

<!--@include: ./_shared.md-->

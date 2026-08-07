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

Orb, waveform-field, and radial-bars variants share normalized input/output levels, but each state has a distinct signature: idle breathes quietly, listening follows input, thinking travels directionally, and speaking follows output energy. Rapid transitions retarget interruptible springs instead of restarting a timed sequence. Raw PCM is not accepted.

System Reduced Motion is honored automatically. It removes travel, rotation, and elastic overshoot while preserving state color, static level, accessibility labels, and low-performance mode.

<!--@include: ./_shared.md-->

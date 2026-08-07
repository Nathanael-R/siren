# HoldToRecord

`siren-ui add hold-to-record` copies one controlled gesture primitive. Dependencies: Gesture Handler, Haptics, and core warnings. iOS/Android supported; web experimental; Expo Go supported. Wrap gesture roots.

```tsx
<HoldToRecord
  active={recording}
  onStart={start}
  onRelease={stop}
  onCancel={cancel}
  onLock={lock}
/>
```

The control responds on touch-down, starts only after the long-press activates, tracks the finger continuously, exposes cancel/lock threshold progress, and springs back from its current position. Thresholds, RTL mirroring, interruption, causal haptics, and non-gesture cancel/lock buttons are included. Reduced Motion preserves the gesture and feedback while removing travel and pulse motion.

<!--@include: ./_shared.md-->

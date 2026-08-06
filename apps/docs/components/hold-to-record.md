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

Thresholds, RTL mirroring, interruption, haptics, and non-gesture cancel/lock buttons are included.

<!--@include: ./_shared.md-->

# Waveform

`siren-ui add waveform` copies `siren/components/waveform.tsx`. Dependencies: `@siren-ui/core`. iOS/Android supported; web experimental; Expo Go supported; no development build required; no native configuration.

```tsx
<Waveform
  samples={[0.2, 0.7, 0.4]}
  progress={0.35}
  accessibilityLabel="Reply audio"
/>
```

API: normalized `samples`, `progress`, bar dimensions, density, colors, duration, reduced motion, and structural styles.

<!--@include: ./_shared.md-->

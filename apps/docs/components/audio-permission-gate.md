# AudioPermissionGate

`siren-ui add audio-permission-gate` copies the gate and Expo hook. Dependency: `expo-audio`. iOS/Android supported; web experimental; Expo Go supported. Configure application-owned iOS permission copy.

```tsx
<AudioPermissionGate
  renderFallback={({ state, request, openSettings }) => (
    <PermissionView {...{ state, request, openSettings }} />
  )}
>
  <Recorder />
</AudioPermissionGate>
```

States: unknown, requestable, granted, denied, and blocked. Requests are explicit and system dialogs are never imitated.

<!--@include: ./_shared.md-->

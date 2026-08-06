# Troubleshooting

- Native module mismatch: run `npx expo install --check`, rebuild the development client, and run Expo Doctor.
- Reanimated initialization: confirm the SDK-compatible Worklets version and rebuild native code.
- Duplicate native modules: run `pnpm check:duplicates` and keep native dependencies in the app.
- Permission denied: do not re-request automatically; present the request or settings action from the permission state.
- Local update conflict: inspect the `.siren-update` file and migrate manually.

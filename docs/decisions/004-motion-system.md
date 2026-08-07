# ADR 004: purpose-led native motion

**Status:** Accepted pending physical-device feel and performance verification

Siren uses Reanimated shared values for continuous audio, playback, and gesture feedback. Gesture-driven elements track the finger on the UI thread and settle with interruptible springs. React callbacks are crossed only for meaningful state commits, throttled seek previews, and causal haptics.

The motion vocabulary is deliberately small:

- 120 ms strong ease-out for immediate press-in feedback.
- Critically damped 300 ms response for ordinary state changes and release.
- A 0.8 damping ratio only after a momentum-carrying gesture.
- Transform and opacity in frame-sensitive paths.
- System Reduced Motion by default, with explicit overrides for deterministic tests.

Every loop communicates audio or agent state. Idle motion stays low-amplitude; listening follows input level; thinking has directional travel; speaking follows output energy. Reduced Motion removes travel, rotation, and elastic overshoot while preserving static level and state information.

Sources:

- [Apple: Designing Fluid Interfaces](https://developer.apple.com/videos/play/wwdc2018/803/)
- [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Reanimated: withSpring](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/)
- [Reanimated: accessibility](https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility/)
- [Gesture Handler: Pan gesture](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)

The exact feel remains a physical-device release gate. These values are a coherent baseline, not performance evidence.

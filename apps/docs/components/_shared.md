## Usage patterns

Use controlled props when another audio engine owns state. Use the Expo convenience hook when `expo-audio` should own lifecycle. Composed blocks reuse exported primitives; no parallel private implementation exists.

## Errors and accessibility

Errors are typed state, never parsed messages. Override neutral English labels for localization. Verify VoiceOver, TalkBack, RTL, dynamic text, high contrast, reduced motion, and 44-point touch targets in your app.

## Performance and renderers

Inputs are bounded and normalized. Waveforms downsample to visible density. Renderer choice is internal and does not change the public API. Physical-device release measurements remain required before performance claims.

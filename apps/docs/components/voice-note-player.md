# VoiceNotePlayer

`siren-ui add voice-note-player` copies controlled UI and an Expo convenience hook. Dependencies: core, `expo-asset`, `expo-audio`, and Reanimated; Gesture Handler arrives through the scrubber. iOS/Android supported; web experimental; Expo Go supported.

```tsx
<VoiceNotePlayer recording={recording} />
<VoiceNotePlayer source={require("./assets/demo.wav")} samples={samples} durationMs={durationMs} />
<VoiceNotePlayer samples={samples} playing={playing} positionMs={positionMs} durationMs={durationMs} onPlay={play} onPause={pause} onSeek={seek} />
```

`source` accepts any Expo `AudioSource`, including a bundled asset from `require()`. `uri` and `recording` remain available for file-based recordings. Loading, buffering, completion, playback error, speed, seeking, and cleanup are supported. Press feedback is immediate, release is spring-backed, status activity is animated without relying on color alone, and the scrubber follows the finger continuously. Applications coordinate multiple-player ownership.

<!--@include: ./_shared.md-->

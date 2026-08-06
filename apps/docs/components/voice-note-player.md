# VoiceNotePlayer

`siren-ui add voice-note-player` copies controlled UI and an Expo convenience hook. Dependencies: core and `expo-audio`; Gesture Handler arrives through the scrubber. iOS/Android supported; web experimental; Expo Go supported.

```tsx
<VoiceNotePlayer recording={recording} />
<VoiceNotePlayer samples={samples} playing={playing} positionMs={positionMs} durationMs={durationMs} onPlay={play} onPause={pause} onSeek={seek} />
```

Loading, buffering, completion, playback error, speed, seeking, and cleanup are supported. Applications coordinate multiple-player ownership.

<!--@include: ./_shared.md-->

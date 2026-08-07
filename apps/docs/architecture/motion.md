# Motion architecture

Siren uses purpose-led motion for feedback, direct manipulation, and audio-state indication.

- Press feedback begins on touch-down and releases through a critically damped spring.
- Hold and scrub gestures track on the UI thread; JavaScript receives only meaningful commits and throttled previews.
- Idle, listening, thinking, and speaking use distinct visual signatures rather than one generic pulse.
- Live waveform samples interpolate between bounded history states instead of snapping.
- Reduced Motion removes travel, rotation, and elastic overshoot while retaining static level and state feedback.

Listening and speaking use a fast-attack, slower-release envelope so audio energy lands immediately and relaxes without meter jitter. The orb's layered ripples and internal light bands all derive from that same energy value.

`LiveWaveform` is a moving history of real normalized samples: the newest sample enters at the leading edge while older samples form a subtle recency trail. Recorded waveform bars remain stationary because their shape is fixed audio data; only playback progress and its playhead sweep across them.

Frame-sensitive work changes transforms and opacity. Physical-device release-build profiling remains required before making renderer or performance claims.

See [ADR 004](https://github.com/siren-ui/siren/blob/main/docs/decisions/004-motion-system.md) for the source material and exact motion vocabulary.

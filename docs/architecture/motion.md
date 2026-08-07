# Motion architecture

Siren motion has three jobs: immediate feedback, continuous gesture tracking, and legible audio or agent state.

## Interaction path

Press feedback begins on touch-down. Holds and scrubs update shared values on the UI thread. Drag callbacks cross to JavaScript only when a cancel, lock, release, or throttled seek-preview event becomes meaningful. Springs retarget from the current presentation value, so rapid reversals do not restart from a stale origin.

## State signatures

- **Idle:** restrained breathing with no attention-demanding travel.
- **Listening:** input-level response with a wider inhale/exhale range.
- **Thinking:** directional wave travel and orbit, communicating activity without pretending audio is playing.
- **Speaking:** fast output-level response and stronger expansion.

Listening and speaking use an envelope follower with a fast attack and a slower release. Sudden audio energy therefore lands immediately, while the visual relaxes instead of flickering between meter samples. Layered ripples and internal light bands share that same energy source; they decorate the signal without replacing it.

## Waveform truthfulness

`LiveWaveform` is a moving sample history, not a decorative sine wave. Every new normalized sample enters at the leading edge, older samples move through the bounded history, and recency is communicated with a subtle opacity trail. Height always represents the supplied amplitude.

Recorded `Waveform` bars remain stationary because their shape represents fixed audio data. During playback, the progress color and playhead sweep across those bars; the underlying samples do not wobble or pulse.

## Accessibility

System Reduced Motion is honored by default. The fallback removes translation, rotation, continuous oscillation, and elastic overshoot. Opacity, static amplitude, state labels, and direct manipulation remain available so motion is never the only state channel.

## Performance boundary

Animated hot paths use transforms and opacity. Waveform history and visualizer bar counts remain bounded. The current native-view renderer must still be measured on physical release builds; Skia is adopted only if those measurements justify it.

# Audio model

Public time uses milliseconds. Waveform input is immutable normalized amplitude buckets in `[0, 1]`; raw PCM, metering decibels, and provider levels are converted before reaching visuals. `expo-audio` is the first-party recording/playback lifecycle, while controlled components accept other engines.

Temporary recording files are hook-owned during capture. Ownership transfers to the application only after successful completion. Siren never uploads, stores, authenticates, transcribes, or decodes remote URLs. Existing-file extraction is a pluggable `WaveformExtractor` contract.

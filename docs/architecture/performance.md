# Performance architecture

- Sample arrays are bucketed before rendering.
- Live history and native bar counts are bounded.
- Metering updates do not append unbounded arrays.
- Animation work uses transforms/opacity and short worklets.
- Gestures recognize on the UI side; seek previews are delivered at most every 100 ms.
- Expo player/recorder resources are hook-scoped and cleaned on unmount.

Release-build physical-device measurement is required. The playground includes dense input, long-running history, rapid transitions, reduced motion, low-performance mode, and JS-thread contention.

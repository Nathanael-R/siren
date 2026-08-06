# ADR 003: initial renderers

**Status:** Accepted pending physical-device measurements

Waveforms use a bounded React Native `View` renderer. Visible bars are derived from measured width and downsampled before rendering, preventing one-view-per-input-sample behavior. AgentVisualizer uses bounded native views and Reanimated transforms; Skia remains an optional renderer boundary, not a public API requirement.

No production performance claim is made yet. The release playground and harness establish the scenarios, while real release-build measurements remain unchecked in `docs/performance/` and the device matrix. A switch to Skia requires recorded measurements showing the view renderer misses the target.

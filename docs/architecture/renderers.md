# Renderer architecture

Waveforms expose renderer-independent normalized samples. v0.1 uses a bounded native-view renderer: layout derives visible capacity, peak bucketing limits elements, and progress changes presentation without changing the data model. LiveWaveform creates a fixed bar set and updates shared values.

AgentVisualizer uses bounded Reanimated transforms for three variants. Skia is declared by the playground for representative comparison but is not imported into components that do not need it. ADR 003 defines the evidence required before switching renderers.

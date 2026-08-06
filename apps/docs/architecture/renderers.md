# Renderer architecture

Waveform APIs are renderer-independent. The initial bounded native-view renderer derives visible density before rendering. Live bars and visualizer motion use Reanimated shared values. Skia is introduced only after release-build measurements show a need.

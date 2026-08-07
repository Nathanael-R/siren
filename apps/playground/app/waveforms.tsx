import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { ScenarioCard } from "@/components/scenario-card";
import { LiveWaveform } from "@/siren/components/live-waveform";
import { Waveform } from "@/siren/components/waveform";
import { WaveformScrubber } from "@/siren/components/waveform-scrubber";
import { DemoAudioShowcase } from "@/components/demo-audio-showcase";

const small = [0.15, 0.4, 0.7, 0.3, 0.9, 0.45, 0.2];
const large = Array.from(
  { length: 12_000 },
  (_, index) => 0.1 + Math.abs(Math.sin(index * 0.071)) * 0.9,
);

export default function WaveformsScreen() {
  const [positionMs, setPositionMs] = useState(18_000);
  const [sample, setSample] = useState(0.2);
  const [paused, setPaused] = useState(false);
  const [history, setHistory] = useState(48);
  useEffect(() => {
    if (paused) return;
    let tick = 0;
    const timer = setInterval(() => {
      tick += 1;
      setSample(0.08 + Math.abs(Math.sin(tick * 0.47)) * 0.9);
    }, 100);
    return () => clearInterval(timer);
  }, [paused]);
  const contention = () => {
    const end = Date.now() + 350;
    while (Date.now() < end) Math.sqrt(Math.random());
  };
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <ScenarioCard
        title="Audio-synchronized waveform"
        description="The fixed waveform, moving playhead, and live history all share the audible clip's precomputed amplitude envelope."
      >
        <DemoAudioShowcase mode="waveform" />
      </ScenarioCard>
      <ScenarioCard title="Small and extreme sizes">
        <Waveform samples={small} progress={0.4} height={28} />
        <Waveform
          samples={small}
          progress={0.7}
          height={96}
          barWidth={8}
          gap={5}
        />
      </ScenarioCard>
      <ScenarioCard
        title="Large and dense input"
        description="12,000 supplied samples are automatically bucketed to visible density."
      >
        <Waveform samples={large} progress={0.33} maximumDensity={160} />
      </ScenarioCard>
      <ScenarioCard title="Scrubbing and RTL-ready seeking">
        <WaveformScrubber
          samples={large}
          positionMs={positionMs}
          durationMs={60_000}
          onSeek={setPositionMs}
          onSeekPreview={setPositionMs}
        />
        <Text style={styles.meta}>{Math.round(positionMs)} ms</Text>
      </ScenarioCard>
      <ScenarioCard
        title="Live bounded history"
        description={`Fixed history: ${history}. Includes pause, reduced-motion fallback, and long-running mode.`}
      >
        <LiveWaveform sample={sample} paused={paused} historySize={history} />
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={() => setPaused((value) => !value)}
        >
          <Text>{paused ? "Resume samples" : "Pause samples"}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={() => setHistory((value) => (value === 48 ? 120 : 48))}
        >
          <Text>Toggle dense history</Text>
        </Pressable>
        <LiveWaveform
          sample={sample}
          historySize={24}
          reducedMotion
          accessibilityLabel="Reduced motion live level"
        />
      </ScenarioCard>
      <ScenarioCard title="JS-thread contention">
        <LiveWaveform sample={sample} />
        <Pressable
          testID="waveform-contention"
          accessibilityRole="button"
          style={styles.button}
          onPress={contention}
        >
          <Text>Block JS for 350 ms</Text>
        </Pressable>
      </ScenarioCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  button: {
    minHeight: 44,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8B929E",
  },
  meta: { color: "#5D6470", fontVariant: ["tabular-nums"] },
});

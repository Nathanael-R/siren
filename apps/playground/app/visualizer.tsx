import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { AgentVisualizerState } from "@siren-ui/core/recording";
import { ScenarioCard } from "@/components/scenario-card";
import { AgentVisualizer } from "@/siren/components/agent-visualizer";

const states: AgentVisualizerState[] = [
  "idle",
  "listening",
  "thinking",
  "speaking",
];
const variants = ["orb", "waveform-field", "radial-bars"] as const;

export default function VisualizerScreen() {
  const [state, setState] = useState<AgentVisualizerState>("idle");
  const [level, setLevel] = useState(0.2);
  useEffect(() => {
    let tick = 0;
    const timer = setInterval(() => {
      tick += 1;
      setLevel(0.08 + Math.abs(Math.sin(tick * 0.42)) * 0.9);
    }, 100);
    return () => clearInterval(timer);
  }, []);
  const contention = () => {
    const end = Date.now() + 350;
    while (Date.now() < end) Math.cos(Math.random());
  };
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <View style={styles.controls}>
        {states.map((value) => (
          <Pressable
            key={value}
            testID={`state-${value}`}
            accessibilityRole="button"
            accessibilityState={{ selected: state === value }}
            onPress={() => setState(value)}
            style={[styles.button, state === value && styles.selected]}
          >
            <Text>{value}</Text>
          </Pressable>
        ))}
      </View>
      {variants.map((variant) => (
        <ScenarioCard key={variant} title={variant}>
          <AgentVisualizer
            variant={variant}
            state={state}
            inputLevel={level}
            outputLevel={level}
          />
        </ScenarioCard>
      ))}
      <ScenarioCard title="Reduced motion and low-performance">
        <View style={styles.row}>
          <AgentVisualizer
            state={state}
            inputLevel={level}
            outputLevel={level}
            reducedMotion
            style={styles.small}
          />
          <AgentVisualizer
            variant="radial-bars"
            state={state}
            inputLevel={level}
            outputLevel={level}
            lowPerformanceMode
            style={styles.small}
          />
        </View>
      </ScenarioCard>
      <ScenarioCard title="Rapid transitions, contention, and long-running animation">
        <Pressable
          testID="visualizer-rapid"
          accessibilityRole="button"
          style={styles.button}
          onPress={() =>
            states.forEach((value, index) =>
              setTimeout(() => setState(value), index * 70),
            )
          }
        >
          <Text>Run rapid transitions</Text>
        </Pressable>
        <Pressable
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
  controls: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  button: {
    minHeight: 44,
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8B929E",
  },
  selected: { backgroundColor: "#DCE9FF", borderColor: "#266EF1" },
  row: { flexDirection: "row", gap: 8 },
  small: { flex: 1, minWidth: 0 },
});

import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { AgentVisualizerState } from "@siren-ui/core/recording";
import { ScenarioCard } from "@/components/scenario-card";
import { AgentVisualizer } from "@/siren/components/agent-visualizer";
import { MotionPressable } from "@/siren/components/motion-pressable";
import { DemoAudioShowcase } from "@/components/demo-audio-showcase";

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
      <ScenarioCard
        title="Audio-driven orb"
        description="Play a bundled clip to drive the orb from its matching amplitude envelope instead of a decorative loop."
      >
        <DemoAudioShowcase mode="visualizer" />
      </ScenarioCard>
      <View style={styles.controls}>
        {states.map((value) => (
          <MotionPressable
            key={value}
            testID={`state-${value}`}
            accessibilityRole="button"
            accessibilityState={{ selected: state === value }}
            onPress={() => setState(value)}
            style={[styles.button, state === value && styles.selected]}
            pressedScale={0.94}
          >
            <Text
              style={[
                styles.buttonText,
                state === value && styles.selectedText,
              ]}
            >
              {value}
            </Text>
          </MotionPressable>
        ))}
      </View>
      {variants.map((variant) => (
        <ScenarioCard key={variant} title={variant}>
          <View style={styles.visualStage}>
            <AgentVisualizer
              variant={variant}
              state={state}
              inputLevel={level}
              outputLevel={level}
            />
          </View>
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
        <MotionPressable
          testID="visualizer-rapid"
          accessibilityRole="button"
          style={styles.actionButton}
          onPress={() =>
            states.forEach((value, index) =>
              setTimeout(() => setState(value), index * 70),
            )
          }
        >
          <Text>Run rapid transitions</Text>
        </MotionPressable>
        <MotionPressable
          accessibilityRole="button"
          style={styles.actionButton}
          onPress={contention}
        >
          <Text>Block JS for 350 ms</Text>
        </MotionPressable>
      </ScenarioCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, backgroundColor: "#F7F8FA" },
  controls: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 16,
    backgroundColor: "#E9ECF1",
    gap: 3,
  },
  button: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  selected: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#15171A",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonText: { color: "#68707C", fontSize: 12, fontWeight: "600" },
  selectedText: { color: "#15171A" },
  actionButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8B929E",
    backgroundColor: "#FFFFFF",
  },
  visualStage: {
    minHeight: 176,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D1224",
    overflow: "hidden",
  },
  row: { flexDirection: "row", gap: 8 },
  small: { flex: 1, minWidth: 0 },
});

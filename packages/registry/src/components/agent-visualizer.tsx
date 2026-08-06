import type { AgentVisualizerState } from "@siren-ui/core/recording";
import { normalizeAmplitude } from "@siren-ui/core/waveform";
import { memo, useEffect } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type AgentVisualizerProps = {
  state: AgentVisualizerState;
  inputLevel?: number;
  outputLevel?: number;
  variant?: "orb" | "waveform-field" | "radial-bars";
  reducedMotion?: boolean;
  lowPerformanceMode?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const stateScale: Record<AgentVisualizerState, number> = {
  idle: 0.72,
  listening: 0.9,
  thinking: 0.82,
  speaking: 1,
};

export const AgentVisualizer = memo(function AgentVisualizer({
  state,
  inputLevel = 0,
  outputLevel = 0,
  variant = "orb",
  reducedMotion = false,
  lowPerformanceMode = false,
  accessibilityLabel,
  style,
}: AgentVisualizerProps) {
  const level =
    state === "speaking"
      ? normalizeAmplitude(outputLevel)
      : normalizeAmplitude(inputLevel);
  const animatedLevel = useSharedValue(level);
  const animatedState = useSharedValue(stateScale[state]);
  useEffect(() => {
    animatedLevel.value = reducedMotion
      ? level
      : withTiming(level, { duration: 90 });
    animatedState.value = reducedMotion
      ? stateScale[state]
      : withTiming(stateScale[state], { duration: 220 });
  }, [animatedLevel, animatedState, level, reducedMotion, state]);
  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedState.value + animatedLevel.value * 0.16 }],
    opacity: 0.7 + animatedLevel.value * 0.3,
  }));
  const count = lowPerformanceMode ? 8 : variant === "orb" ? 3 : 20;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? `Agent is ${state}`}
      style={[styles.root, style]}
    >
      {variant === "orb" ? (
        <Animated.View style={[styles.orb, orbStyle]}>
          <View style={styles.orbCore} />
        </Animated.View>
      ) : (
        <View
          style={[styles.field, variant === "radial-bars" && styles.radial]}
        >
          {Array.from({ length: count }, (_, index) => (
            <VisualizerBar
              key={index}
              index={index}
              count={count}
              level={animatedLevel}
              radial={variant === "radial-bars"}
              reducedMotion={reducedMotion}
            />
          ))}
        </View>
      )}
    </View>
  );
});

function VisualizerBar({
  index,
  count,
  level,
  radial,
  reducedMotion,
}: {
  index: number;
  count: number;
  level: { value: number };
  radial: boolean;
  reducedMotion: boolean;
}) {
  const style = useAnimatedStyle(() => ({
    transform: [
      { rotate: radial ? `${(index / count) * 360}deg` : "0deg" },
      {
        scaleY: reducedMotion
          ? 0.35
          : 0.18 + level.value * (0.4 + ((index * 7) % 11) / 16),
      },
    ],
  }));
  return (
    <Animated.View
      style={[styles.visualBar, radial && styles.radialBar, style]}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    minWidth: 120,
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  orb: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#9FC5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  orbCore: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#266EF1",
  },
  field: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  radial: { width: 110, borderRadius: 55 },
  visualBar: {
    width: 4,
    height: 76,
    borderRadius: 2,
    backgroundColor: "#266EF1",
  },
  radialBar: { position: "absolute", height: 96, transformOrigin: "center" },
});

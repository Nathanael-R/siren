import { normalizeAmplitude } from "@siren-ui/core/waveform";
import { developmentWarning } from "@siren-ui/core/warnings";
import { memo, useEffect, useRef } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { shouldReduceMotion, sirenEaseOut } from "../motion";

export type LiveWaveformProps = {
  sample: number;
  historySize?: number;
  paused?: boolean;
  direction?: "left-to-right" | "right-to-left";
  height?: number;
  color?: string;
  reducedMotion?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

function LiveBar({
  values,
  index,
  height,
  color,
  reducedMotion,
  recency,
  newest,
  arrival,
}: {
  values: SharedValue<number[]>;
  index: number;
  height: number;
  color: string;
  reducedMotion: boolean;
  recency: number;
  newest: boolean;
  arrival: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const value = values.value[index] ?? 0.04;
    const arrivalScale =
      newest && !reducedMotion ? 1 + arrival.value * 0.45 : 1;
    return {
      opacity: reducedMotion
        ? 0.82
        : (0.34 + value * 0.66) * (0.56 + recency * 0.44),
      transform: [{ scaleX: arrivalScale }, { scaleY: Math.max(0.04, value) }],
    };
  }, [height, index, newest, recency, reducedMotion]);
  return (
    <Animated.View
      style={[styles.bar, { height, backgroundColor: color }, animatedStyle]}
    />
  );
}

export const LiveWaveform = memo(function LiveWaveform({
  sample,
  historySize = 48,
  paused = false,
  direction = "left-to-right",
  height = 48,
  color = "#266EF1",
  reducedMotion,
  accessibilityLabel = "Live microphone level",
  style,
}: LiveWaveformProps) {
  const safeSize = Math.max(4, Math.min(160, Math.floor(historySize)));
  const systemReducedMotion = useReducedMotion();
  const reduce = shouldReduceMotion(reducedMotion, systemReducedMotion);
  const values = useSharedValue(new Array<number>(safeSize).fill(0.04));
  const arrival = useSharedValue(0);
  const history = useRef(new Array<number>(safeSize).fill(0.04));
  developmentWarning(
    "live-history",
    historySize <= 160,
    "LiveWaveform history is capped at 160 samples to keep work bounded.",
  );

  useEffect(() => {
    history.current = new Array<number>(safeSize).fill(0.04);
    values.set(history.current);
  }, [safeSize, values]);

  useEffect(() => {
    if (paused) return;
    const next = history.current.slice(1);
    next.push(normalizeAmplitude(sample));
    history.current = next;
    arrival.set(reduce ? 0 : 1);
    if (!reduce) {
      arrival.set(withTiming(0, { duration: 180, easing: sirenEaseOut }));
    }
    values.set(
      reduce ? next : withTiming(next, { duration: 120, easing: sirenEaseOut }),
    );
  }, [arrival, paused, reduce, sample, values]);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: paused }}
      style={[
        styles.root,
        direction === "right-to-left" && styles.reverse,
        { height },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={[styles.centerline, { backgroundColor: color }]}
      />
      {Array.from({ length: safeSize }, (_, index) => (
        <LiveBar
          key={index}
          values={values}
          index={index}
          height={height}
          color={color}
          reducedMotion={reduce}
          recency={index / Math.max(1, safeSize - 1)}
          newest={index === safeSize - 1}
          arrival={arrival}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    overflow: "hidden",
  },
  reverse: { flexDirection: "row-reverse" },
  bar: { flex: 1, minWidth: 1, borderRadius: 999 },
  centerline: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: StyleSheet.hairlineWidth,
    opacity: 0.2,
  },
});

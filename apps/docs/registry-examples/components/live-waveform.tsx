import { normalizeAmplitude } from "@siren-ui/core/waveform";
import { developmentWarning } from "@siren-ui/core/warnings";
import { memo, useEffect } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

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
}: {
  values: SharedValue<number[]>;
  index: number;
  height: number;
  color: string;
  reducedMotion: boolean;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const value = values.value[index] ?? 0.04;
    return {
      transform: [{ scaleY: reducedMotion ? 0.35 : Math.max(0.04, value) }],
    };
  }, [height, index, reducedMotion]);
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
  reducedMotion = false,
  accessibilityLabel = "Live microphone level",
  style,
}: LiveWaveformProps) {
  const safeSize = Math.max(4, Math.min(160, Math.floor(historySize)));
  const values = useSharedValue(new Array<number>(safeSize).fill(0.04));
  developmentWarning(
    "live-history",
    historySize <= 160,
    "LiveWaveform history is capped at 160 samples to keep work bounded.",
  );

  useEffect(() => {
    if (paused) return;
    const next = values.value.slice(1);
    next.push(normalizeAmplitude(sample));
    values.value = next;
  }, [paused, sample, values]);

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
      {Array.from({ length: safeSize }, (_, index) => (
        <LiveBar
          key={index}
          values={values}
          index={index}
          height={height}
          color={color}
          reducedMotion={reducedMotion}
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
});

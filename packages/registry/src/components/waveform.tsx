import { describeWaveform } from "@siren-ui/core/accessibility";
import {
  bucketSamples,
  deriveVisibleBucketCount,
  normalizeAmplitude,
} from "@siren-ui/core/waveform";
import { developmentWarning } from "@siren-ui/core/warnings";
import { memo, useMemo, useState } from "react";
import {
  PixelRatio,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WaveformProps = {
  samples: readonly number[];
  progress?: number;
  height?: number;
  barWidth?: number;
  gap?: number;
  maximumDensity?: number;
  color?: string;
  playedColor?: string;
  accessibilityLabel?: string;
  durationMs?: number;
  reducedMotion?: boolean;
  style?: StyleProp<ViewStyle>;
  barStyle?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
};

export const Waveform = memo(function Waveform({
  samples,
  progress = 0,
  height = 48,
  barWidth = 3,
  gap = 2,
  maximumDensity = 240,
  color = "#8B929E",
  playedColor = "#266EF1",
  accessibilityLabel,
  durationMs,
  style,
  barStyle,
  onLayout,
}: WaveformProps) {
  const [width, setWidth] = useState(0);
  developmentWarning(
    "waveform-height",
    height >= 24,
    "Waveform heights below 24 points can be difficult to perceive.",
  );
  const safeProgress = normalizeAmplitude(progress);
  const visible = useMemo(() => {
    const count = deriveVisibleBucketCount({
      width,
      barWidth,
      gap,
      maximumDensity,
      pixelRatio: PixelRatio.get(),
    });
    return bucketSamples(samples, count);
  }, [barWidth, gap, maximumDensity, samples, width]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
    onLayout?.(event);
  };

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={
        accessibilityLabel ??
        describeWaveform({ durationMs, progress: safeProgress })
      }
      onLayout={handleLayout}
      style={[styles.root, { height, gap }, style]}
    >
      {visible.map((sample, index) => {
        const played =
          visible.length < 2
            ? safeProgress > 0
            : index / (visible.length - 1) <= safeProgress;
        return (
          <View
            key={index}
            accessible={false}
            style={[
              styles.bar,
              {
                width: barWidth,
                height: Math.max(2, sample * height),
                backgroundColor: played ? playedColor : color,
              },
              barStyle,
            ]}
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "center", overflow: "hidden" },
  bar: { borderRadius: 999 },
});

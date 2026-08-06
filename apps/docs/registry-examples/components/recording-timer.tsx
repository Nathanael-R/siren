import { formatDuration } from "@siren-ui/core/time";
import { memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

export type RecordingTimerProps = {
  durationMs: number;
  state: "recording" | "paused" | "processing";
  warningThresholdMs?: number;
  maximumDurationMs?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const RecordingTimer = memo(function RecordingTimer({
  durationMs,
  state,
  warningThresholdMs,
  maximumDurationMs,
  style,
  textStyle,
}: RecordingTimerProps) {
  const warning =
    warningThresholdMs !== undefined && durationMs >= warningThresholdMs;
  const current = formatDuration(durationMs);
  const maximum =
    maximumDurationMs === undefined
      ? undefined
      : formatDuration(maximumDurationMs);
  const stateLabel =
    state === "recording"
      ? "Recording"
      : state === "paused"
        ? "Recording paused"
        : "Processing recording";
  return (
    <View
      accessible
      accessibilityRole="timer"
      accessibilityLabel={`${stateLabel}, ${current}${maximum ? ` of ${maximum}` : ""}`}
      accessibilityLiveRegion="polite"
      style={[styles.root, style]}
    >
      <Text style={[styles.time, warning && styles.warning, textStyle]}>
        {current}
        {maximum ? ` / ${maximum}` : ""}
      </Text>
      <Text style={styles.state}>{stateLabel}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  root: { alignItems: "center", gap: 3 },
  time: {
    color: "#15171A",
    fontSize: 20,
    fontVariant: ["tabular-nums"],
    fontWeight: "600",
  },
  warning: { color: "#A12A34" },
  state: { color: "#5D6470", fontSize: 13 },
});

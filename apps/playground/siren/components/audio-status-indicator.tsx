import { memo, type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type AudioStatus =
  | "loading"
  | "buffering"
  | "ready"
  | "playing"
  | "paused"
  | "recording"
  | "interrupted"
  | "route-changed"
  | "recovering"
  | "error";
const defaults: Record<AudioStatus, string> = {
  loading: "Loading audio",
  buffering: "Buffering",
  ready: "Ready",
  playing: "Playing",
  paused: "Paused",
  recording: "Recording",
  interrupted: "Audio interrupted",
  "route-changed": "Audio route changed",
  recovering: "Recovering audio",
  error: "Audio error",
};

export const AudioStatusIndicator = memo(function AudioStatusIndicator({
  status,
  label,
  icon,
  style,
}: {
  status: AudioStatus;
  label?: string;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const text = label ?? defaults[status];
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={text}
      accessibilityLiveRegion="polite"
      style={[styles.root, style]}
    >
      {icon}
      <View style={[styles.dot, status === "error" && styles.error]} />
      <Text style={styles.label}>{text}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  root: { minHeight: 28, flexDirection: "row", alignItems: "center", gap: 7 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#357A57" },
  error: { backgroundColor: "#B4232F" },
  label: { color: "#454B55", fontSize: 13 },
});

import { memo, useEffect, type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { shouldReduceMotion, sirenEaseOut } from "../motion";

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
const colors: Record<AudioStatus, string> = {
  loading: "#5277C8",
  buffering: "#B26A00",
  ready: "#357A57",
  playing: "#266EF1",
  paused: "#68707C",
  recording: "#D92D3A",
  interrupted: "#B26A00",
  "route-changed": "#7455D9",
  recovering: "#5277C8",
  error: "#B4232F",
};

export const AudioStatusIndicator = memo(function AudioStatusIndicator({
  status,
  label,
  icon,
  style,
  reducedMotion,
}: {
  status: AudioStatus;
  label?: string;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  reducedMotion?: boolean;
}) {
  const text = label ?? defaults[status];
  const systemReducedMotion = useReducedMotion();
  const reduce = shouldReduceMotion(reducedMotion, systemReducedMotion);
  const pulse = useSharedValue(0);
  const shouldPulse = [
    "loading",
    "buffering",
    "playing",
    "recording",
    "recovering",
  ].includes(status);
  useEffect(() => {
    cancelAnimation(pulse);
    if (!shouldPulse || reduce) {
      pulse.set(shouldPulse ? 0.5 : 0);
      return;
    }
    pulse.set(0);
    pulse.set(
      withRepeat(
        withTiming(1, {
          duration: status === "recording" ? 620 : 900,
          easing: sirenEaseOut,
        }),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(pulse);
  }, [pulse, reduce, shouldPulse, status]);
  const dotStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: shouldPulse ? interpolate(pulse.get(), [0, 1], [0.88, 1.08]) : 1,
      },
    ],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: shouldPulse ? interpolate(pulse.get(), [0, 1], [0.24, 0]) : 0,
    transform: [
      {
        scale: shouldPulse
          ? interpolate(pulse.get(), [0, 1], [0.75, 1.8])
          : 0.75,
      },
    ],
  }));
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={text}
      accessibilityLiveRegion="polite"
      style={[styles.root, style]}
    >
      {icon}
      <View style={styles.dotWrap}>
        <Animated.View
          style={[styles.ring, { backgroundColor: colors[status] }, ringStyle]}
        />
        <Animated.View
          style={[styles.dot, { backgroundColor: colors[status] }, dotStyle]}
        />
      </View>
      <Text style={styles.label}>{text}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  root: { minHeight: 28, flexDirection: "row", alignItems: "center", gap: 7 },
  dotWrap: {
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: { position: "absolute", width: 10, height: 10, borderRadius: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { color: "#454B55", fontSize: 13 },
});

import { adjustableStep } from "@siren-ui/core/accessibility";
import { normalizeAmplitude } from "@siren-ui/core/waveform";
import { developmentWarning } from "@siren-ui/core/warnings";
import { useEffect, useMemo, useRef } from "react";
import {
  I18nManager,
  StyleSheet,
  View,
  type AccessibilityActionEvent,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  shouldReduceMotion,
  sirenEaseOut,
  sirenPressIn,
  sirenStateSpring,
} from "../motion";
import { Waveform } from "./waveform";

export type WaveformScrubberProps = {
  samples: readonly number[];
  positionMs: number;
  durationMs: number;
  onSeekPreview?: (positionMs: number) => void;
  onSeek: (positionMs: number) => void;
  height?: number;
  disabled?: boolean;
  reducedMotion?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function WaveformScrubber({
  samples,
  positionMs,
  durationMs,
  onSeekPreview,
  onSeek,
  height = 52,
  disabled = false,
  reducedMotion,
  accessibilityLabel = "Audio position",
  style,
}: WaveformScrubberProps) {
  const systemReducedMotion = useReducedMotion();
  const reduce = shouldReduceMotion(reducedMotion, systemReducedMotion);
  const width = useSharedValue(1);
  const progress = useSharedValue(
    durationMs > 0 ? normalizeAmplitude(positionMs / durationMs) : 0,
  );
  const pressed = useSharedValue(0);
  const lastPreviewAt = useSharedValue(0);
  const seeking = useRef(false);
  developmentWarning(
    "scrubber-height",
    height >= 44,
    "WaveformScrubber should be at least 44 points tall for a safe touch target.",
  );

  useEffect(() => {
    if (seeking.current) return;
    const next =
      durationMs > 0 ? normalizeAmplitude(positionMs / durationMs) : 0;
    progress.set(
      reduce ? next : withTiming(next, { duration: 120, easing: sirenEaseOut }),
    );
  }, [durationMs, positionMs, progress, reduce]);

  const markSeeking = (value: boolean) => {
    seeking.current = value;
  };
  const rtl = I18nManager.isRTL;
  const gesture = useMemo(() => {
    const ratioAt = (x: number) => {
      "worklet";
      const ratio = Math.max(0, Math.min(1, x / width.get()));
      return rtl ? 1 - ratio : ratio;
    };
    const begin = () => {
      "worklet";
      pressed.set(withTiming(1, sirenPressIn));
      runOnJS(markSeeking)(true);
    };
    const finalize = () => {
      "worklet";
      pressed.set(reduce ? 0 : withSpring(0, sirenStateSpring));
      runOnJS(markSeeking)(false);
    };
    return Gesture.Race(
      Gesture.Pan()
        .enabled(!disabled)
        .minDistance(1)
        .onBegin(begin)
        .onUpdate(({ x }) => {
          const next = ratioAt(x);
          progress.set(next);
          const now = Date.now();
          if (onSeekPreview && now - lastPreviewAt.get() >= 100) {
            lastPreviewAt.set(now);
            runOnJS(onSeekPreview)(next * Math.max(0, durationMs));
          }
        })
        .onEnd(({ x }) => {
          const next = ratioAt(x);
          progress.set(next);
          runOnJS(onSeek)(next * Math.max(0, durationMs));
        })
        .onFinalize(finalize),
      Gesture.Tap()
        .enabled(!disabled)
        .onBegin(begin)
        .onEnd(({ x }) => {
          const next = ratioAt(x);
          progress.set(reduce ? next : withSpring(next, sirenStateSpring));
          runOnJS(onSeek)(next * Math.max(0, durationMs));
        })
        .onFinalize(finalize),
    );
  }, [
    disabled,
    durationMs,
    lastPreviewAt,
    onSeek,
    onSeekPreview,
    pressed,
    progress,
    reduce,
    rtl,
    width,
  ]);

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (
      event.nativeEvent.actionName !== "increment" &&
      event.nativeEvent.actionName !== "decrement"
    )
      return;
    onSeek(
      adjustableStep(positionMs, durationMs, event.nativeEvent.actionName),
    );
  };

  const onLayout = (event: LayoutChangeEvent) => {
    width.set(Math.max(1, event.nativeEvent.layout.width));
  };
  const progressStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.get() }],
  }));
  const thumbStyle = useAnimatedStyle(() => {
    const physicalProgress = rtl ? 1 - progress.get() : progress.get();
    return {
      opacity: interpolate(pressed.get(), [0, 1], [0.78, 1]),
      transform: [
        { translateX: physicalProgress * width.get() - 7 },
        {
          scale: reduce ? 1 : interpolate(pressed.get(), [0, 1], [0.82, 1.16]),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{
          min: 0,
          max: Math.max(0, Math.round(durationMs)),
          now: Math.round(positionMs),
          text: `${Math.round(positionMs / 1000)} seconds`,
        }}
        accessibilityActions={[
          { name: "increment", label: "Seek forward" },
          { name: "decrement", label: "Seek backward" },
        ]}
        onAccessibilityAction={onAccessibilityAction}
        onLayout={onLayout}
        style={[styles.touchArea, { minHeight: height }, style]}
      >
        <View pointerEvents="none" style={styles.track}>
          <Animated.View
            style={[
              styles.progress,
              rtl ? styles.progressRtl : styles.progressLtr,
              progressStyle,
            ]}
          />
        </View>
        <Waveform
          samples={samples}
          progress={durationMs > 0 ? positionMs / durationMs : 0}
          height={Math.max(24, height - 12)}
          reducedMotion={reduce}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.thumb, thumbStyle]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  touchArea: { justifyContent: "center", width: "100%" },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 999,
    backgroundColor: "rgba(38,110,241,0.12)",
    overflow: "hidden",
  },
  progress: {
    ...StyleSheet.absoluteFill,
    borderRadius: 999,
    backgroundColor: "rgba(38,110,241,0.38)",
  },
  progressLtr: { transformOrigin: "left center" },
  progressRtl: { transformOrigin: "right center" },
  thumb: {
    position: "absolute",
    left: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#266EF1",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#15171A",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});

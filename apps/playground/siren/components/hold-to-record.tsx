import { developmentWarning } from "@siren-ui/core/warnings";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo } from "react";
import {
  I18nManager,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  shouldReduceMotion,
  sirenGestureSpring,
  sirenPressIn,
  sirenStateSpring,
} from "../motion";

export type HoldToRecordProps = {
  active: boolean;
  locked?: boolean;
  disabled?: boolean;
  cancelThreshold?: number;
  lockThreshold?: number;
  holdDelayMs?: number;
  onStart: () => void;
  onCancel: () => void;
  onLock: () => void;
  onRelease: () => void;
  label?: string;
  cancelLabel?: string;
  lockLabel?: string;
  reducedMotion?: boolean;
  style?: StyleProp<ViewStyle>;
};

function rubberBand(value: number, limit: number) {
  "worklet";
  const magnitude = Math.abs(value);
  if (magnitude <= limit) return value;
  return Math.sign(value) * (limit + (magnitude - limit) * 0.18);
}

const startHaptic = () =>
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
const cancelHaptic = () =>
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
const lockHaptic = () => void Haptics.selectionAsync();

export function HoldToRecord({
  active,
  locked = false,
  disabled = false,
  cancelThreshold = 88,
  lockThreshold = 72,
  holdDelayMs = 180,
  onStart,
  onCancel,
  onLock,
  onRelease,
  label = "Hold to record",
  cancelLabel = "Cancel recording",
  lockLabel = "Lock recording",
  reducedMotion,
  style,
}: HoldToRecordProps) {
  developmentWarning(
    "hold-target",
    cancelThreshold >= 64 && lockThreshold >= 56,
    "Hold gesture thresholds may be too small to avoid accidental actions.",
  );
  const systemReducedMotion = useReducedMotion();
  const reduce = shouldReduceMotion(reducedMotion, systemReducedMotion);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const pressed = useSharedValue(0);
  const cancelProgress = useSharedValue(0);
  const lockProgress = useSharedValue(0);
  const cancelled = useSharedValue(false);
  const didLock = useSharedValue(false);
  const didStart = useSharedValue(false);
  const recordingPulse = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(recordingPulse);
    if (!active || reduce) {
      recordingPulse.set(active ? 1 : 0);
      return;
    }
    recordingPulse.set(0);
    recordingPulse.set(withRepeat(withTiming(1, { duration: 620 }), -1, true));
    return () => cancelAnimation(recordingPulse);
  }, [active, recordingPulse, reduce]);

  const resetGesture = () => {
    "worklet";
    pressed.set(withSpring(0, sirenStateSpring));
    dragX.set(reduce ? 0 : withSpring(0, sirenGestureSpring));
    dragY.set(reduce ? 0 : withSpring(0, sirenGestureSpring));
    cancelProgress.set(withTiming(0, sirenPressIn));
    lockProgress.set(withTiming(0, sirenPressIn));
  };

  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .enabled(!disabled && !locked)
      .manualActivation(true)
      .shouldCancelWhenOutside(false)
      .onTouchesMove((_event, stateManager) => {
        if (didStart.get()) stateManager.activate();
      })
      .onUpdate(({ translationX, translationY }) => {
        if (cancelled.get() || didLock.get()) return;
        const cancelDistance = I18nManager.isRTL ? translationX : -translationX;
        const lockDistance = -translationY;
        const cancelIntent = Math.max(0, cancelDistance);
        const lockIntent = Math.max(0, lockDistance);
        dragX.set(rubberBand(translationX, cancelThreshold));
        dragY.set(rubberBand(translationY, lockThreshold));
        cancelProgress.set(Math.min(1, cancelIntent / cancelThreshold));
        lockProgress.set(Math.min(1, lockIntent / lockThreshold));

        if (cancelIntent >= cancelThreshold && cancelIntent > lockIntent) {
          cancelled.set(true);
          runOnJS(cancelHaptic)();
          runOnJS(onCancel)();
        } else if (lockIntent >= lockThreshold && lockIntent >= cancelIntent) {
          didLock.set(true);
          runOnJS(lockHaptic)();
          runOnJS(onLock)();
        }
      });
    const longPress = Gesture.LongPress()
      .enabled(!disabled && !locked)
      .minDuration(holdDelayMs)
      .maxDistance(20)
      .shouldCancelWhenOutside(false)
      .onBegin(() => {
        pressed.set(withTiming(1, sirenPressIn));
      })
      .onStart(() => {
        didStart.set(true);
        cancelled.set(false);
        didLock.set(false);
        runOnJS(startHaptic)();
        runOnJS(onStart)();
      })
      .onEnd((_event, success) => {
        if (success && !cancelled.get() && !didLock.get()) runOnJS(onRelease)();
      })
      .onFinalize(() => {
        didStart.set(false);
        resetGesture();
      });
    return Gesture.Simultaneous(longPress, pan);
  }, [
    cancelProgress,
    cancelThreshold,
    cancelled,
    didLock,
    didStart,
    disabled,
    dragX,
    dragY,
    holdDelayMs,
    lockProgress,
    lockThreshold,
    locked,
    onCancel,
    onLock,
    onRelease,
    onStart,
    pressed,
    reduce,
  ]);

  const controlStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.get(), [0, 1], [1, 0.94]),
    transform: [
      { translateX: dragX.get() },
      { translateY: dragY.get() },
      {
        scale: reduce ? 1 : interpolate(pressed.get(), [0, 1], [1, 0.965]),
      },
    ],
  }));
  const glyphStyle = useAnimatedStyle(() => ({
    opacity: active ? interpolate(recordingPulse.get(), [0, 1], [0.72, 1]) : 1,
    transform: [
      {
        scale:
          active && !reduce
            ? interpolate(recordingPulse.get(), [0, 1], [0.82, 1.18])
            : 1,
      },
    ],
  }));
  const cancelGuideStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.get(), [0, 1], [0, 1]),
    transform: [
      {
        translateX: reduce
          ? 0
          : interpolate(cancelProgress.get(), [0, 1], [8, -8]),
      },
      { scale: interpolate(cancelProgress.get(), [0, 1], [0.96, 1.04]) },
    ],
  }));
  const lockGuideStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.get(), [0, 1], [0, 1]),
    transform: [
      {
        translateY: reduce
          ? 0
          : interpolate(lockProgress.get(), [0, 1], [6, -8]),
      },
      { scale: interpolate(lockProgress.get(), [0, 1], [0.96, 1.04]) },
    ],
  }));

  return (
    <View style={[styles.container, style]}>
      <View pointerEvents="none" style={styles.guides}>
        <Animated.View style={[styles.guide, cancelGuideStyle]}>
          <Text style={styles.guideArrow}>{I18nManager.isRTL ? "›" : "‹"}</Text>
          <Text style={styles.guideLabel}>Slide to cancel</Text>
        </Animated.View>
        <Animated.View style={[styles.guide, lockGuideStyle]}>
          <Text style={styles.guideArrow}>↑</Text>
          <Text style={styles.guideLabel}>Slide to lock</Text>
        </Animated.View>
      </View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={controlStyle}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint="Double tap to start recording, or press and hold then slide left to cancel or up to lock"
            accessibilityState={{ disabled, selected: active }}
            disabled={disabled}
            hitSlop={8}
            onPress={active ? onRelease : onStart}
            style={[styles.record, active && styles.active]}
          >
            <Animated.View style={[styles.recordGlyph, glyphStyle]} />
            <Text style={styles.label}>
              {active ? "Release to stop" : label}
            </Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
      {active ? (
        <View style={styles.alternatives}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            onPress={onCancel}
            style={({ pressed: isPressed }) => [
              styles.action,
              isPressed && styles.actionPressed,
            ]}
          >
            <Text>{cancelLabel}</Text>
          </Pressable>
          {!locked ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={lockLabel}
              onPress={onLock}
              style={({ pressed: isPressed }) => [
                styles.action,
                isPressed && styles.actionPressed,
              ]}
            >
              <Text>{lockLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  guides: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  guide: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    minHeight: 28,
    borderRadius: 999,
    backgroundColor: "#F1F3F6",
  },
  guideArrow: { color: "#266EF1", fontSize: 18, fontWeight: "700" },
  guideLabel: { color: "#5D6470", fontSize: 12, fontWeight: "600" },
  record: {
    minHeight: 56,
    minWidth: 176,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#ECEEF2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  active: { backgroundColor: "#FFE5E7" },
  recordGlyph: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#D92D3A",
  },
  label: { color: "#15171A", fontSize: 16, fontWeight: "600" },
  alternatives: { flexDirection: "row", gap: 8, justifyContent: "center" },
  action: {
    minHeight: 44,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8B929E",
  },
  actionPressed: { opacity: 0.7 },
});

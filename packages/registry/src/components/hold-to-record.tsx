import { developmentWarning } from "@siren-ui/core/warnings";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
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
  style?: StyleProp<ViewStyle>;
};

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
  style,
}: HoldToRecordProps) {
  developmentWarning(
    "hold-target",
    cancelThreshold >= 64 && lockThreshold >= 56,
    "Hold gesture thresholds may be too small to avoid accidental actions.",
  );
  let cancelled = false;
  let didLock = false;
  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled && !locked)
        .activateAfterLongPress(holdDelayMs)
        .runOnJS(true)
        .onBegin(() => {
          cancelled = false;
          didLock = false;
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onStart();
        })
        .onUpdate(({ translationX, translationY }) => {
          const cancelDistance = I18nManager.isRTL
            ? translationX
            : -translationX;
          if (!cancelled && cancelDistance >= cancelThreshold) {
            cancelled = true;
            void Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning,
            );
            onCancel();
          } else if (!didLock && -translationY >= lockThreshold) {
            didLock = true;
            void Haptics.selectionAsync();
            onLock();
          }
        })
        .onEnd(() => {
          if (!cancelled && !didLock) onRelease();
        }),
    [
      cancelThreshold,
      disabled,
      holdDelayMs,
      lockThreshold,
      locked,
      onCancel,
      onLock,
      onRelease,
      onStart,
    ],
  );

  return (
    <View style={[styles.container, style]}>
      <GestureDetector gesture={gesture}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint="Double tap to start recording, or press and hold then slide left to cancel or up to lock"
          accessibilityState={{ disabled, selected: active }}
          disabled={disabled}
          onPress={active ? onRelease : onStart}
          style={({ pressed }) => [
            styles.record,
            active && styles.active,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.recordGlyph} />
          <Text style={styles.label}>{active ? "Release to stop" : label}</Text>
        </Pressable>
      </GestureDetector>
      {active ? (
        <View style={styles.alternatives}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            onPress={onCancel}
            style={styles.action}
          >
            <Text>{cancelLabel}</Text>
          </Pressable>
          {!locked ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={lockLabel}
              onPress={onLock}
              style={styles.action}
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
  record: {
    minHeight: 52,
    minWidth: 160,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "#ECEEF2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  active: { backgroundColor: "#FFE5E7" },
  pressed: { opacity: 0.7 },
  recordGlyph: {
    width: 14,
    height: 14,
    borderRadius: 7,
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
});

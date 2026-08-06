import { adjustableStep } from "@siren-ui/core/accessibility";
import { normalizeAmplitude } from "@siren-ui/core/waveform";
import { developmentWarning } from "@siren-ui/core/warnings";
import { useMemo, useRef, useState } from "react";
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
  const width = useRef(1);
  const lastPreviewAt = useRef(0);
  const [previewMs, setPreviewMs] = useState<number>();
  developmentWarning(
    "scrubber-height",
    height >= 44,
    "WaveformScrubber should be at least 44 points tall for a safe touch target.",
  );

  const toPosition = (x: number) => {
    const ratio = normalizeAmplitude(x / width.current);
    return (I18nManager.isRTL ? 1 - ratio : ratio) * Math.max(0, durationMs);
  };

  const gesture = useMemo(
    () =>
      Gesture.Race(
        Gesture.Pan()
          .enabled(!disabled)
          .runOnJS(true)
          .onUpdate(({ x }) => {
            const next = toPosition(x);
            setPreviewMs(next);
            const now = Date.now();
            if (now - lastPreviewAt.current >= 100) {
              lastPreviewAt.current = now;
              onSeekPreview?.(next);
            }
          })
          .onEnd(({ x }) => {
            const next = toPosition(x);
            setPreviewMs(undefined);
            onSeek(next);
          })
          .onFinalize(() => setPreviewMs(undefined)),
        Gesture.Tap()
          .enabled(!disabled)
          .runOnJS(true)
          .onEnd(({ x }) => onSeek(toPosition(x))),
      ),
    [disabled, durationMs, onSeek, onSeekPreview],
  );

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
    width.current = Math.max(1, event.nativeEvent.layout.width);
  };
  const shownPosition = previewMs ?? positionMs;

  return (
    <GestureDetector gesture={gesture}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{
          min: 0,
          max: Math.max(0, Math.round(durationMs)),
          now: Math.round(shownPosition),
          text: `${Math.round(shownPosition / 1000)} seconds`,
        }}
        accessibilityActions={[
          { name: "increment", label: "Seek forward" },
          { name: "decrement", label: "Seek backward" },
        ]}
        onAccessibilityAction={onAccessibilityAction}
        onLayout={onLayout}
        style={[styles.touchArea, { minHeight: height }, style]}
      >
        <Waveform
          samples={samples}
          progress={durationMs > 0 ? shownPosition / durationMs : 0}
          height={Math.max(24, height - 12)}
          reducedMotion={reducedMotion}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  touchArea: { justifyContent: "center", width: "100%" },
});

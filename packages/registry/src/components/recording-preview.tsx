import type { SirenRecording } from "@siren-ui/core/recording";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  VoiceNotePlayer,
  type VoiceNotePlayerProps,
} from "./voice-note-player";
import { MotionPressable } from "./motion-pressable";

export function RecordingPreview({
  recording,
  source,
  onDiscard,
  onConfirm,
  loading = false,
  error,
  reducedMotion,
  style,
}: {
  recording: SirenRecording;
  source?: VoiceNotePlayerProps["source"];
  onDiscard: () => void;
  onConfirm: (recording: SirenRecording) => void;
  loading?: boolean;
  error?: string;
  reducedMotion?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View accessibilityLabel="Recording preview" style={[styles.root, style]}>
      <VoiceNotePlayer
        recording={recording}
        source={source}
        loading={loading}
        error={!!error}
        reducedMotion={reducedMotion}
      />
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <MotionPressable
          onPress={onDiscard}
          style={styles.secondary}
          reducedMotion={reducedMotion}
        >
          <Text>Discard</Text>
        </MotionPressable>
        <MotionPressable
          onPress={() => onConfirm(recording)}
          disabled={loading}
          style={styles.primary}
          reducedMotion={reducedMotion}
        >
          <Text style={styles.primaryText}>Use recording</Text>
        </MotionPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 12 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  secondary: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8B929E",
  },
  primary: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#15171A",
  },
  primaryText: { color: "#FFFFFF", fontWeight: "600" },
  error: { color: "#A12A34" },
});

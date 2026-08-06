import type { SirenRecording } from "@siren-ui/core/recording";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { VoiceNotePlayer } from "./voice-note-player";

export function RecordingPreview({
  recording,
  onDiscard,
  onConfirm,
  loading = false,
  error,
  style,
}: {
  recording: SirenRecording;
  onDiscard: () => void;
  onConfirm: (recording: SirenRecording) => void;
  loading?: boolean;
  error?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View accessibilityLabel="Recording preview" style={[styles.root, style]}>
      <VoiceNotePlayer
        recording={recording}
        loading={loading}
        error={!!error}
      />
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={onDiscard}
          style={styles.secondary}
        >
          <Text>Discard</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onConfirm(recording)}
          disabled={loading}
          style={styles.primary}
        >
          <Text style={styles.primaryText}>Use recording</Text>
        </Pressable>
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

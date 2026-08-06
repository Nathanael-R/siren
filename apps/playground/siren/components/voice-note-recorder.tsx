import type {
  SirenRecording,
  VoiceNoteRecorderRef,
} from "@siren-ui/core/recording";
import { forwardRef, useImperativeHandle } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useExpoVoiceRecorder } from "../hooks/use-expo-voice-recorder";
import { AudioStatusIndicator } from "./audio-status-indicator";
import { HoldToRecord } from "./hold-to-record";
import { LiveWaveform } from "./live-waveform";
import { RecordingPreview } from "./recording-preview";
import { RecordingTimer } from "./recording-timer";

export type VoiceNoteRecorderProps = {
  minimumDurationMs?: number;
  maximumDurationMs?: number;
  warningThresholdMs?: number;
  requestPermissionOnStart?: boolean;
  onComplete: (recording: SirenRecording) => void;
  onError?: (error: unknown) => void;
  labels?: Partial<Record<"cancel" | "lock" | "retry" | "record", string>>;
  style?: StyleProp<ViewStyle>;
};

export const VoiceNoteRecorder = forwardRef<
  VoiceNoteRecorderRef,
  VoiceNoteRecorderProps
>(function VoiceNoteRecorder(
  {
    minimumDurationMs,
    maximumDurationMs,
    warningThresholdMs,
    requestPermissionOnStart = false,
    onComplete,
    onError,
    labels,
    style,
  },
  ref,
) {
  const recorder = useExpoVoiceRecorder({
    minimumDurationMs,
    maximumDurationMs,
    requestPermissionOnStart,
    onComplete,
    onError,
  });
  const { snapshot } = recorder;
  useImperativeHandle(
    ref,
    () => ({
      start: recorder.start,
      stop: recorder.stop,
      cancel: recorder.cancel,
      pause: recorder.pause,
      resume: recorder.resume,
    }),
    [recorder],
  );
  if (snapshot.state === "preview" && snapshot.recording)
    return (
      <RecordingPreview
        recording={snapshot.recording}
        onDiscard={recorder.reset}
        onConfirm={onComplete}
        style={style}
      />
    );
  if (snapshot.state === "error")
    return (
      <View style={[styles.root, style]}>
        <AudioStatusIndicator
          status="error"
          label={snapshot.error?.type.replaceAll("-", " ")}
        />
        {snapshot.error?.type === "recording-interrupted" &&
        snapshot.error.partialUri ? (
          <Text selectable style={styles.message}>
            A partial recording is available at {snapshot.error.partialUri}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={recorder.reset}
          style={styles.action}
        >
          <Text>{labels?.retry ?? "Try again"}</Text>
        </Pressable>
      </View>
    );
  const active =
    snapshot.state === "recording" ||
    snapshot.state === "locked" ||
    snapshot.state === "paused";
  return (
    <View accessibilityLabel="Voice note recorder" style={[styles.root, style]}>
      <AudioStatusIndicator
        status={
          snapshot.state === "processing"
            ? "loading"
            : snapshot.state === "paused"
              ? "paused"
              : active
                ? "recording"
                : "ready"
        }
      />
      {active ? (
        <>
          <LiveWaveform
            sample={recorder.sample}
            paused={snapshot.state === "paused"}
          />
          <RecordingTimer
            durationMs={snapshot.durationMs}
            state={snapshot.state === "paused" ? "paused" : "recording"}
            warningThresholdMs={warningThresholdMs}
            maximumDurationMs={maximumDurationMs}
          />
        </>
      ) : null}
      <HoldToRecord
        active={active}
        locked={snapshot.state === "locked" || snapshot.state === "paused"}
        disabled={snapshot.state === "processing"}
        onStart={() => void recorder.start()}
        onCancel={() => void recorder.cancel()}
        onLock={recorder.lock}
        onRelease={() => void recorder.stop()}
        label={labels?.record}
        cancelLabel={labels?.cancel}
        lockLabel={labels?.lock}
      />
      {snapshot.state === "locked" || snapshot.state === "paused" ? (
        <View style={styles.row}>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              void (snapshot.state === "paused"
                ? recorder.resume()
                : recorder.pause())
            }
            style={styles.action}
          >
            <Text>{snapshot.state === "paused" ? "Resume" : "Pause"}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => void recorder.stop()}
            style={styles.action}
          >
            <Text>Finish</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  root: { padding: 16, gap: 14, borderRadius: 20, backgroundColor: "#F8F9FA" },
  row: { flexDirection: "row", gap: 8 },
  action: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8B929E",
  },
  message: { color: "#5D6470" },
});

import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { SirenRecording } from "@siren-ui/core/recording";
import { ScenarioCard } from "@/components/scenario-card";
import { AudioPermissionGate } from "@/siren/components/audio-permission-gate";
import { AudioStatusIndicator } from "@/siren/components/audio-status-indicator";
import { HoldToRecord } from "@/siren/components/hold-to-record";
import { RecordingTimer } from "@/siren/components/recording-timer";
import { VoiceNoteRecorder } from "@/siren/components/voice-note-recorder";

export default function RecorderScreen() {
  const [mockState, setMockState] = useState<"idle" | "recording" | "locked">(
    "idle",
  );
  const [result, setResult] = useState<SirenRecording>();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <ScenarioCard
        title="Real microphone"
        description="Explicit permission, start/stop, too-short rejection, maximum duration, preview, discard, rapid start/stop, backgrounding, and remount cleanup use the production hook."
      >
        <AudioPermissionGate>
          <VoiceNoteRecorder
            minimumDurationMs={500}
            maximumDurationMs={30_000}
            warningThresholdMs={25_000}
            onComplete={setResult}
          />
        </AudioPermissionGate>
        {result ? (
          <Text selectable style={styles.meta}>
            Application owns: {result.uri}
          </Text>
        ) : null}
      </ScenarioCard>
      <ScenarioCard
        title="Gesture mechanics"
        description="Slide left to cancel, slide up to lock; buttons provide non-gesture alternatives."
      >
        <HoldToRecord
          active={mockState !== "idle"}
          locked={mockState === "locked"}
          onStart={() => setMockState("recording")}
          onCancel={() => setMockState("idle")}
          onLock={() => setMockState("locked")}
          onRelease={() => setMockState("idle")}
        />
        <RecordingTimer
          durationMs={12_500}
          state="recording"
          warningThresholdMs={10_000}
          maximumDurationMs={15_000}
        />
      </ScenarioCard>
      <ScenarioCard title="Permission and interruption recovery">
        <View style={styles.states}>
          <AudioStatusIndicator status="interrupted" />
          <AudioStatusIndicator status="recovering" />
          <AudioStatusIndicator status="route-changed" />
          <AudioStatusIndicator
            status="error"
            label="Permission permanently blocked — open settings"
          />
        </View>
      </ScenarioCard>
      <ScenarioCard
        title="Lifecycle checklist"
        description="Use this screen to exercise phone-call interruption, app background/foreground, pause/resume, partial recovery, and cleanup/remount on a physical device."
      >
        <Pressable
          testID="recorder-remount"
          accessibilityRole="button"
          style={styles.button}
          onPress={() => setResult(undefined)}
        >
          <Text>Reset scenario</Text>
        </Pressable>
      </ScenarioCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  states: { gap: 6 },
  meta: { color: "#5D6470" },
  button: {
    minHeight: 44,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8B929E",
  },
});

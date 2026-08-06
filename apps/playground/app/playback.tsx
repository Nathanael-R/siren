import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScenarioCard } from "@/components/scenario-card";
import { AudioStatusIndicator } from "@/siren/components/audio-status-indicator";
import { RecordingPreview } from "@/siren/components/recording-preview";
import { VoiceNotePlayer } from "@/siren/components/voice-note-player";

const samples = Array.from(
  { length: 180 },
  (_, index) => 0.12 + Math.abs(Math.sin(index * 0.3)) * 0.84,
);
const recording = {
  uri: "file:///deterministic-scenario.m4a",
  durationMs: 42_000,
  waveform: samples,
};

export default function PlaybackScreen() {
  const [playing, setPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(9_000);
  const [owner, setOwner] = useState<"a" | "b">("a");
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
    >
      <ScenarioCard
        title="Controlled player"
        description="Deterministic data exercises play/pause, speed, scrubbing, and completion without reading a file."
      >
        <VoiceNotePlayer
          samples={samples}
          durationMs={42_000}
          positionMs={positionMs}
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onSeek={setPositionMs}
        />
      </ScenarioCard>
      <ScenarioCard title="Loading, buffering, and failure">
        <View style={styles.stack}>
          <VoiceNotePlayer samples={samples} durationMs={42_000} loading />
          <AudioStatusIndicator status="buffering" />
          <VoiceNotePlayer samples={samples} durationMs={42_000} error />
        </View>
      </ScenarioCard>
      <ScenarioCard title="Recording preview">
        <RecordingPreview
          recording={recording}
          onDiscard={() => setPositionMs(0)}
          onConfirm={() => setPlaying(false)}
        />
      </ScenarioCard>
      <ScenarioCard
        title="Multiple-player ownership"
        description="Starting one controlled player transfers ownership and pauses the other."
      >
        <Text>Active player: {owner.toUpperCase()}</Text>
        <View style={styles.row}>
          {(["a", "b"] as const).map((id) => (
            <Pressable
              key={id}
              accessibilityRole="button"
              style={styles.button}
              onPress={() => setOwner(id)}
            >
              <Text>Play {id.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
      </ScenarioCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  stack: { gap: 12 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 44,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8B929E",
  },
});

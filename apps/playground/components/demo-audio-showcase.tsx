import { useState } from "react";
import { useAssets } from "expo-asset";
import { setAudioModeAsync, type AudioSource } from "expo-audio";
import { StyleSheet, Text, View } from "react-native";
import {
  demoAudioClips,
  type DemoAudioClip,
} from "@/data/demo-audio.generated";
import { AgentVisualizer } from "@/siren/components/agent-visualizer";
import { LiveWaveform } from "@/siren/components/live-waveform";
import { MotionPressable } from "@/siren/components/motion-pressable";
import { RecordingPreview } from "@/siren/components/recording-preview";
import { VoiceNotePlayer } from "@/siren/components/voice-note-player";
import { useVoiceNotePlayer } from "@/siren/hooks/use-voice-note-player";

export type DemoAudioShowcaseProps = {
  mode?: "player" | "waveform" | "visualizer";
};

function levelAtPosition(clip: DemoAudioClip, positionMs: number) {
  const progress = Math.max(0, Math.min(1, positionMs / clip.durationMs));
  const exactIndex = progress * Math.max(0, clip.waveform.length - 1);
  const leftIndex = Math.floor(exactIndex);
  const rightIndex = Math.min(clip.waveform.length - 1, leftIndex + 1);
  const mix = exactIndex - leftIndex;
  const left = clip.waveform[leftIndex] ?? 0.04;
  const right = clip.waveform[rightIndex] ?? left;
  return left + (right - left) * mix;
}

function resolvedSource(uri: string, clip: DemoAudioClip): AudioSource {
  return { uri, name: clip.title };
}

export function DemoAudioShowcase({ mode = "player" }: DemoAudioShowcaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const clip = demoAudioClips[selectedIndex] ?? demoAudioClips[0]!;
  const [assets, assetError] = useAssets([clip.source]);
  const asset = assets?.[0];
  const uri = asset?.localUri ?? asset?.uri;

  return (
    <View style={styles.root}>
      <View accessibilityRole="tablist" style={styles.choices}>
        {demoAudioClips.map((candidate, index) => {
          const selected = index === selectedIndex;
          return (
            <MotionPressable
              key={candidate.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setSelectedIndex(index)}
              style={[styles.choice, selected && styles.choiceSelected]}
              pressedScale={0.96}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.choiceText,
                  selected && styles.choiceTextSelected,
                ]}
              >
                {candidate.title}
              </Text>
            </MotionPressable>
          );
        })}
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>{clip.title}</Text>
        <Text style={styles.description}>{clip.description}</Text>
      </View>

      {assetError ? (
        <Text accessibilityRole="alert" style={styles.error}>
          Unable to prepare the bundled audio asset.
        </Text>
      ) : uri ? (
        <DemoAudioRuntime
          key={clip.id}
          clip={clip}
          mode={mode}
          source={resolvedSource(uri, clip)}
        />
      ) : (
        <Text accessibilityLiveRegion="polite" style={styles.loading}>
          Preparing offline audio…
        </Text>
      )}
    </View>
  );
}

function DemoAudioRuntime({
  clip,
  mode,
  source,
}: {
  clip: DemoAudioClip;
  mode: NonNullable<DemoAudioShowcaseProps["mode"]>;
  source: AudioSource;
}) {
  const [audioError, setAudioError] = useState<string>();
  const playback = useVoiceNotePlayer(source);
  const level = levelAtPosition(clip, playback.positionMs);

  const play = async () => {
    try {
      setAudioError(undefined);
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        interruptionMode: "doNotMix",
      });
      if (playback.didJustFinish) await playback.seek(0);
      playback.play();
    } catch (cause) {
      setAudioError(
        cause instanceof Error ? cause.message : "Audio playback unavailable",
      );
    }
  };

  return (
    <>
      {mode === "visualizer" ? (
        <View style={styles.visualizerStage}>
          <AgentVisualizer
            state={
              playback.loading || playback.buffering
                ? "thinking"
                : playback.playing
                  ? "speaking"
                  : "idle"
            }
            outputLevel={level}
            accessibilityLabel={`${clip.title} playback energy`}
          />
          <Text style={styles.visualizerCaption}>
            {playback.playing
              ? "Responding to the clip envelope"
              : "Play the clip to drive the orb"}
          </Text>
        </View>
      ) : null}

      {mode === "waveform" ? (
        <View style={styles.liveStage}>
          <LiveWaveform
            sample={playback.playing ? level : 0.04}
            paused={!playback.playing}
            historySize={64}
            accessibilityLabel={`${clip.title} live amplitude history`}
          />
          <Text style={styles.liveCaption}>
            Live history follows the same envelope as the audible clip.
          </Text>
        </View>
      ) : null}

      <VoiceNotePlayer
        samples={clip.waveform}
        playing={playback.playing}
        positionMs={playback.positionMs}
        durationMs={clip.durationMs}
        loading={playback.loading}
        buffering={playback.buffering}
        error={!!audioError}
        onPlay={() => void play()}
        onPause={playback.pause}
        onSeek={(positionMs) => void playback.seek(positionMs)}
        onPlaybackRateChange={playback.setRate}
        accessibilityLabel={`${clip.title} demo player`}
      />
      {audioError ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {audioError}
        </Text>
      ) : null}
    </>
  );
}

export function DemoRecordingPreview({
  onDiscard,
  onConfirm,
}: {
  onDiscard: () => void;
  onConfirm: () => void;
}) {
  const clip = demoAudioClips[0]!;
  const [assets, assetError] = useAssets([clip.source]);
  const asset = assets?.[0];
  const uri = asset?.localUri ?? asset?.uri;
  if (assetError)
    return <Text style={styles.error}>Unable to prepare preview audio.</Text>;
  if (!uri) return <Text style={styles.loading}>Preparing preview audio…</Text>;
  const recording = {
    uri,
    durationMs: clip.durationMs,
    waveform: clip.waveform,
  };
  return (
    <RecordingPreview
      recording={recording}
      onDiscard={onDiscard}
      onConfirm={onConfirm}
    />
  );
}

const styles = StyleSheet.create({
  root: { gap: 12 },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  choice: {
    minHeight: 38,
    paddingHorizontal: 11,
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#C6CAD1",
    backgroundColor: "#FFFFFF",
  },
  choiceSelected: { borderColor: "#266EF1", backgroundColor: "#E9F0FF" },
  choiceText: { color: "#5D6470", fontSize: 12, fontWeight: "600" },
  choiceTextSelected: { color: "#174EA6" },
  copy: { gap: 2 },
  title: { color: "#15171A", fontSize: 16, fontWeight: "700" },
  description: { color: "#5D6470", lineHeight: 19 },
  error: { color: "#A12A34", lineHeight: 19 },
  loading: { color: "#68707C", lineHeight: 19 },
  liveStage: {
    gap: 6,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  liveCaption: { color: "#68707C", fontSize: 12 },
  visualizerStage: {
    minHeight: 184,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#0D1224",
    overflow: "hidden",
  },
  visualizerCaption: {
    color: "#C8D1E6",
    fontSize: 12,
    letterSpacing: 0.2,
  },
});

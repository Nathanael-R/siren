import type { SirenRecording } from "@siren-ui/core/recording";
import { memo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useVoiceNotePlayer } from "../hooks/use-voice-note-player";
import { AudioStatusIndicator } from "./audio-status-indicator";
import { WaveformScrubber } from "./waveform-scrubber";

export type VoiceNotePlayerProps = {
  recording?: SirenRecording;
  uri?: string;
  samples?: readonly number[];
  playing?: boolean;
  positionMs?: number;
  durationMs?: number;
  loading?: boolean;
  buffering?: boolean;
  error?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (positionMs: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  playbackRates?: readonly number[];
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const VoiceNotePlayer = memo(function VoiceNotePlayer(
  props: VoiceNotePlayerProps,
) {
  const convenience = useVoiceNotePlayer(props.recording?.uri ?? props.uri);
  const controlled = props.playing !== undefined;
  const playing = props.playing ?? convenience.playing;
  const positionMs = props.positionMs ?? convenience.positionMs;
  const durationMs =
    props.durationMs ?? props.recording?.durationMs ?? convenience.durationMs;
  const samples = props.samples ??
    props.recording?.waveform ?? [0.2, 0.55, 0.34, 0.8, 0.45, 0.67, 0.28];
  const loading = props.loading ?? convenience.loading;
  const buffering = props.buffering ?? convenience.buffering;
  const rates = props.playbackRates ?? [1, 1.5, 2];
  const [rateIndex, setRateIndex] = useState(0);
  const toggle = () => {
    if (playing) (props.onPause ?? convenience.pause)();
    else (props.onPlay ?? convenience.play)();
  };
  const seek = (next: number) => {
    if (props.onSeek) props.onSeek(next);
    else if (!controlled) void convenience.seek(next);
  };
  const cycleRate = () => {
    const nextIndex = (rateIndex + 1) % rates.length;
    const rate = rates[nextIndex] ?? 1;
    setRateIndex(nextIndex);
    props.onPlaybackRateChange?.(rate);
    if (!controlled) convenience.setRate(rate);
  };
  const status = props.error
    ? "error"
    : loading
      ? "loading"
      : buffering
        ? "buffering"
        : playing
          ? "playing"
          : positionMs > 0
            ? "paused"
            : "ready";
  return (
    <View
      accessibilityLabel={props.accessibilityLabel ?? "Voice note player"}
      style={[styles.root, props.style]}
    >
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={playing ? "Pause voice note" : "Play voice note"}
          onPress={toggle}
          disabled={loading || props.error}
          style={styles.play}
        >
          <Text style={styles.playText}>{playing ? "Pause" : "Play"}</Text>
        </Pressable>
        <AudioStatusIndicator status={status} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Playback speed ${rates[rateIndex] ?? 1} times`}
          onPress={cycleRate}
          style={styles.rate}
        >
          <Text>{rates[rateIndex] ?? 1}×</Text>
        </Pressable>
      </View>
      <WaveformScrubber
        samples={samples}
        positionMs={positionMs}
        durationMs={durationMs}
        disabled={loading || !!props.error}
        onSeek={seek}
      />
      <View style={styles.times}>
        <Text style={styles.time}>{Math.floor(positionMs / 1000)}s</Text>
        <Text style={styles.time}>{Math.floor(durationMs / 1000)}s</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: { padding: 14, gap: 8, borderRadius: 18, backgroundColor: "#F3F4F6" },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  play: {
    minWidth: 56,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#15171A",
  },
  playText: { color: "#FFFFFF", fontWeight: "600" },
  rate: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8B929E",
  },
  times: { flexDirection: "row", justifyContent: "space-between" },
  time: { color: "#5D6470", fontVariant: ["tabular-nums"] },
});

import type { SirenRecording } from "@siren-ui/core/recording";
import { formatDuration } from "@siren-ui/core/time";
import type { AudioSource } from "expo-audio";
import { memo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useVoiceNotePlayer } from "../hooks/use-voice-note-player";
import { AudioStatusIndicator } from "./audio-status-indicator";
import { MotionPressable } from "./motion-pressable";
import { WaveformScrubber } from "./waveform-scrubber";

export type VoiceNotePlayerProps = {
  recording?: SirenRecording;
  source?: AudioSource;
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
  reducedMotion?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export const VoiceNotePlayer = memo(function VoiceNotePlayer(
  props: VoiceNotePlayerProps,
) {
  const hasSource =
    props.source != null || props.recording?.uri != null || props.uri != null;
  return props.playing !== undefined || !hasSource ? (
    <VoiceNotePlayerView {...props} controlled />
  ) : (
    <ExpoVoiceNotePlayer {...props} />
  );
});

function ExpoVoiceNotePlayer(props: VoiceNotePlayerProps) {
  const playback = useVoiceNotePlayer(
    props.source ?? props.recording?.uri ?? props.uri,
  );
  return <VoiceNotePlayerView {...props} playback={playback} />;
}

type PlaybackBinding = ReturnType<typeof useVoiceNotePlayer>;

function VoiceNotePlayerView({
  controlled = false,
  playback,
  ...props
}: VoiceNotePlayerProps & {
  controlled?: boolean;
  playback?: PlaybackBinding;
}) {
  const playing = props.playing ?? playback?.playing ?? false;
  const positionMs = props.positionMs ?? playback?.positionMs ?? 0;
  const durationMs =
    props.durationMs ??
    props.recording?.durationMs ??
    playback?.durationMs ??
    0;
  const samples = props.samples ??
    props.recording?.waveform ?? [0.2, 0.55, 0.34, 0.8, 0.45, 0.67, 0.28];
  const loading = props.loading ?? playback?.loading ?? false;
  const buffering = props.buffering ?? playback?.buffering ?? false;
  const rates = props.playbackRates ?? [1, 1.5, 2];
  const [rateIndex, setRateIndex] = useState(0);
  const toggle = () => {
    if (playing) (props.onPause ?? playback?.pause)?.();
    else (props.onPlay ?? playback?.play)?.();
  };
  const seek = (next: number) => {
    if (props.onSeek) props.onSeek(next);
    else if (!controlled && playback) void playback.seek(next);
  };
  const cycleRate = () => {
    const nextIndex = (rateIndex + 1) % rates.length;
    const rate = rates[nextIndex] ?? 1;
    setRateIndex(nextIndex);
    props.onPlaybackRateChange?.(rate);
    if (!controlled) playback?.setRate(rate);
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
        <MotionPressable
          accessibilityLabel={playing ? "Pause voice note" : "Play voice note"}
          onPress={toggle}
          disabled={loading || props.error}
          style={styles.play}
          pressedScale={0.92}
          reducedMotion={props.reducedMotion}
        >
          {playing ? (
            <View style={styles.pauseGlyph}>
              <View style={styles.pauseBar} />
              <View style={styles.pauseBar} />
            </View>
          ) : (
            <View style={styles.playGlyph} />
          )}
        </MotionPressable>
        <View style={styles.status}>
          <AudioStatusIndicator
            status={status}
            reducedMotion={props.reducedMotion}
          />
        </View>
        <MotionPressable
          accessibilityLabel={`Playback speed ${rates[rateIndex] ?? 1} times`}
          onPress={cycleRate}
          style={styles.rate}
          reducedMotion={props.reducedMotion}
        >
          <Text style={styles.rateText}>{rates[rateIndex] ?? 1}×</Text>
        </MotionPressable>
      </View>
      <WaveformScrubber
        samples={samples}
        positionMs={positionMs}
        durationMs={durationMs}
        disabled={loading || !!props.error}
        onSeek={seek}
        reducedMotion={props.reducedMotion}
      />
      <View style={styles.times}>
        <Text style={styles.time}>{formatDuration(positionMs)}</Text>
        <Text style={styles.time}>{formatDuration(durationMs)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { padding: 14, gap: 10, borderRadius: 20, backgroundColor: "#F3F4F6" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  play: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#15171A",
    shadowColor: "#15171A",
    shadowOpacity: 0.18,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  playGlyph: {
    marginLeft: 3,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 11,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#FFFFFF",
  },
  pauseGlyph: { flexDirection: "row", gap: 4 },
  pauseBar: {
    width: 4,
    height: 15,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  status: { flex: 1 },
  rate: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#C6CAD1",
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  rateText: {
    color: "#343941",
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  times: { flexDirection: "row", justifyContent: "space-between" },
  time: { color: "#5D6470", fontVariant: ["tabular-nums"] },
});

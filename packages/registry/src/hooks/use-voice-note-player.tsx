import { useCallback, useEffect, useMemo } from "react";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioSource,
} from "expo-audio";

export function useVoiceNotePlayer(uri?: string, updateIntervalMs = 100) {
  const source = useMemo<AudioSource | null>(
    () => (uri ? { uri } : null),
    [uri],
  );
  const player = useAudioPlayer(source, {
    updateInterval: updateIntervalMs,
    downloadFirst: false,
  });
  const status = useAudioPlayerStatus(player);
  useEffect(
    () => () => {
      player.pause();
    },
    [player],
  );
  const seek = useCallback(
    async (positionMs: number) => {
      await player.seekTo(Math.max(0, positionMs) / 1000);
    },
    [player],
  );
  const setRate = useCallback(
    (rate: number) => player.setPlaybackRate(Math.min(2, Math.max(0.5, rate))),
    [player],
  );
  return {
    playing: status.playing,
    loading: !status.isLoaded,
    buffering: status.isBuffering,
    didJustFinish: status.didJustFinish,
    positionMs: status.currentTime * 1000,
    durationMs: status.duration * 1000,
    play: () => player.play(),
    pause: () => player.pause(),
    seek,
    setRate,
  };
}

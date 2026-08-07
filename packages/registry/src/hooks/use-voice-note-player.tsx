import { Asset } from "expo-asset";
import { useCallback, useEffect, useMemo } from "react";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  type AudioSource,
} from "expo-audio";

export function useVoiceNotePlayer(
  source?: AudioSource,
  updateIntervalMs = 100,
) {
  const nativeSource = useMemo(() => resolveNativeSource(source), [source]);
  const player = useAudioPlayer(nativeSource, {
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

function resolveNativeSource(source?: AudioSource): AudioSource {
  if (typeof source === "number") {
    const asset = Asset.fromModule(source);
    return { uri: asset.localUri ?? asset.uri, name: asset.name };
  }
  if (
    typeof source === "object" &&
    source !== null &&
    "assetId" in source &&
    typeof source.assetId === "number"
  ) {
    const asset = Asset.fromModule(source.assetId);
    return {
      ...source,
      uri: asset.localUri ?? asset.uri,
      assetId: undefined,
    };
  }
  if (typeof source === "string") return { uri: source };
  return source ?? null;
}

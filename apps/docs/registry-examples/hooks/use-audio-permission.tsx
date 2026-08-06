import { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";
import { AudioModule } from "expo-audio";

export type AudioPermissionState =
  "unknown" | "requestable" | "granted" | "denied" | "blocked";

function mapPermission(permission: {
  granted: boolean;
  canAskAgain: boolean;
  status: string;
}): AudioPermissionState {
  if (permission.granted) return "granted";
  if (permission.status === "undetermined") return "requestable";
  return permission.canAskAgain ? "denied" : "blocked";
}

export function useAudioPermission() {
  const [state, setState] = useState<AudioPermissionState>("unknown");
  useEffect(() => {
    let active = true;
    void AudioModule.getRecordingPermissionsAsync().then((result) => {
      if (active) setState(mapPermission(result));
    });
    return () => {
      active = false;
    };
  }, []);

  const request = useCallback(async () => {
    const result = await AudioModule.requestRecordingPermissionsAsync();
    const next = mapPermission(result);
    setState(next);
    return next;
  }, []);

  const openSettings = useCallback(() => Linking.openSettings(), []);
  return {
    state,
    request,
    openSettings,
    refresh: async () =>
      setState(mapPermission(await AudioModule.getRecordingPermissionsAsync())),
  };
}

import {
  RecorderController,
  type RecorderSnapshot,
} from "@siren-ui/core/recorder-controller";
import type {
  SirenRecorderError,
  SirenRecording,
} from "@siren-ui/core/recording";
import { decibelsToAmplitude } from "@siren-ui/core/waveform";
import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";

export type UseExpoVoiceRecorderOptions = {
  minimumDurationMs?: number;
  maximumDurationMs?: number;
  requestPermissionOnStart?: boolean;
  onComplete?: (recording: SirenRecording) => void;
  onError?: (error: SirenRecorderError) => void;
};

export function useExpoVoiceRecorder(
  options: UseExpoVoiceRecorderOptions = {},
) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 100);
  const controller = useMemo(
    () =>
      new RecorderController({
        minimumDurationMs: options.minimumDurationMs,
        maximumDurationMs: options.maximumDurationMs,
      }),
    [options.maximumDurationMs, options.minimumDurationMs],
  );
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );
  useEffect(() => {
    if (snapshot.error) options.onError?.(snapshot.error);
  }, [options, snapshot.error]);
  useEffect(() => {
    if (snapshot.state === "recording" || snapshot.state === "locked")
      controller.tick();
  }, [controller, recorderState.durationMillis, snapshot.state]);
  useEffect(
    () => () => {
      if (recorderState.isRecording) void recorder.stop();
    },
    [recorder, recorderState.isRecording],
  );

  const start = useCallback(async () => {
    try {
      const permission = await AudioModule.getRecordingPermissionsAsync();
      if (!permission.granted) {
        if (!options.requestPermissionOnStart) {
          controller.requestPermission();
          controller.permissionResolved(false, permission.canAskAgain);
          return;
        }
        controller.requestPermission();
        const requested = await AudioModule.requestRecordingPermissionsAsync();
        if (!requested.granted) {
          controller.permissionResolved(false, requested.canAskAgain);
          return;
        }
      }
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: "doNotMix",
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
      controller.start();
    } catch (cause) {
      controller.unavailable(cause);
    }
  }, [controller, options.requestPermissionOnStart, recorder]);

  const stop = useCallback(async () => {
    try {
      controller.process();
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw new Error("expo-audio did not return a recording URI");
      const recording = controller.complete({
        uri,
        durationMs: recorderState.durationMillis,
      });
      if (recording) options.onComplete?.(recording);
    } catch (cause) {
      controller.interrupt(recorder.uri ?? undefined, cause);
    }
  }, [controller, options, recorder, recorderState.durationMillis]);

  const cancel = useCallback(async () => {
    try {
      if (recorderState.isRecording) await recorder.stop();
    } finally {
      controller.cancel();
    }
  }, [controller, recorder, recorderState.isRecording]);
  const pause = useCallback(async () => {
    recorder.pause();
    controller.pause();
  }, [controller, recorder]);
  const resume = useCallback(async () => {
    recorder.record();
    controller.resume();
  }, [controller, recorder]);
  const lock = useCallback(() => controller.lock(), [controller]);
  return {
    snapshot: {
      ...snapshot,
      durationMs: recorderState.durationMillis,
    } as RecorderSnapshot,
    sample: decibelsToAmplitude(recorderState.metering ?? -60),
    start,
    stop,
    cancel,
    pause,
    resume,
    lock,
    reset: controller.reset.bind(controller),
  };
}

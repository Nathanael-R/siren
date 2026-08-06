import {
  decibelsToAmplitude,
  normalizeAmplitude,
} from "@siren-ui/core/waveform";
import { useCallback } from "react";
import type { SharedValue } from "react-native-reanimated";

export function appendLiveSample(
  buffer: SharedValue<number[]>,
  sample: number,
  historySize: number,
): void {
  "worklet";
  const next = buffer.value.slice(
    Math.max(0, buffer.value.length - historySize + 1),
  );
  next.push(normalizeAmplitude(sample));
  buffer.value = next;
}

export function useExpoMeteringSample(onSample: (sample: number) => void) {
  return useCallback(
    (meteringDb: number | undefined) => {
      if (meteringDb !== undefined) onSample(decibelsToAmplitude(meteringDb));
    },
    [onSample],
  );
}

export function describeWaveform(input: {
  durationMs?: number;
  progress?: number;
  label?: string;
}): string {
  const label = input.label ?? "Audio waveform";
  const progress = Math.round(
    Math.min(1, Math.max(0, input.progress ?? 0)) * 100,
  );
  if (input.durationMs === undefined)
    return `${label}, ${progress} percent played`;
  return `${label}, ${progress} percent played, ${Math.round(input.durationMs / 1000)} seconds`;
}

export function adjustableStep(
  positionMs: number,
  durationMs: number,
  direction: "increment" | "decrement",
): number {
  const safeDuration = Math.max(0, durationMs);
  const step = Math.max(1000, safeDuration * 0.05);
  return Math.min(
    safeDuration,
    Math.max(0, positionMs + (direction === "increment" ? step : -step)),
  );
}

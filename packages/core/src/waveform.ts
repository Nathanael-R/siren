import type { WaveformSamples } from "./recording";

export function normalizeAmplitude(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function decibelsToAmplitude(decibels: number, floorDb = -60): number {
  if (!Number.isFinite(decibels)) return 0;
  const floor = Math.min(-1, floorDb);
  return normalizeAmplitude((Math.max(floor, decibels) - floor) / -floor);
}

export function normalizeSamples(samples: WaveformSamples): number[] {
  return samples.map(normalizeAmplitude);
}

export function bucketSamples(
  samples: WaveformSamples,
  bucketCount: number,
): number[] {
  const count = Math.max(0, Math.floor(bucketCount));
  if (count === 0 || samples.length === 0) return [];
  if (samples.length <= count) return normalizeSamples(samples);

  const result = new Array<number>(count);
  const width = samples.length / count;
  for (let bucket = 0; bucket < count; bucket += 1) {
    const start = Math.floor(bucket * width);
    const end = Math.max(start + 1, Math.floor((bucket + 1) * width));
    let peak = 0;
    for (let index = start; index < end && index < samples.length; index += 1) {
      peak = Math.max(peak, normalizeAmplitude(samples[index] ?? 0));
    }
    result[bucket] = peak;
  }
  return result;
}

export function deriveVisibleBucketCount(input: {
  width: number;
  barWidth: number;
  gap: number;
  pixelRatio?: number;
  maximumDensity?: number;
}): number {
  const width = Math.max(0, input.width);
  const itemWidth = Math.max(1, input.barWidth + Math.max(0, input.gap));
  const densityLimit = Math.max(1, input.maximumDensity ?? 240);
  const pixelLimit = Math.floor(width * Math.max(1, input.pixelRatio ?? 1));
  return Math.max(
    1,
    Math.min(
      densityLimit,
      pixelLimit,
      Math.floor((width + input.gap) / itemWidth),
    ),
  );
}

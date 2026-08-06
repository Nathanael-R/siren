import { describe, expect, it } from "vitest";
import {
  bucketSamples,
  decibelsToAmplitude,
  deriveVisibleBucketCount,
  normalizeAmplitude,
} from "../src/waveform";

describe("waveform utilities", () => {
  it("normalizes unsafe input", () => {
    expect([
      normalizeAmplitude(-1),
      normalizeAmplitude(0.4),
      normalizeAmplitude(4),
      normalizeAmplitude(NaN),
    ]).toEqual([0, 0.4, 1, 0]);
  });

  it("uses peaks while bounding sample density", () => {
    expect(bucketSamples([0, 0.8, 0.2, 1], 2)).toEqual([0.8, 1]);
    expect(
      deriveVisibleBucketCount({
        width: 100,
        barWidth: 2,
        gap: 2,
        maximumDensity: 20,
      }),
    ).toBe(20);
  });

  it("converts metering decibels", () => {
    expect(decibelsToAmplitude(-60)).toBe(0);
    expect(decibelsToAmplitude(0)).toBe(1);
  });
});

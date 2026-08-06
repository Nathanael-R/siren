import { describe, expect, it } from "vitest";
import { FixedRingBuffer } from "../src/ring-buffer";

it("keeps bounded insertion order", () => {
  const buffer = new FixedRingBuffer<number>(3);
  [1, 2, 3, 4].forEach((value) => buffer.push(value));
  expect(buffer.size).toBe(3);
  expect(buffer.toArray()).toEqual([2, 3, 4]);
});

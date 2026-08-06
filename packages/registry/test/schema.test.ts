import { describe, expect, it } from "vitest";
import { registryEntries } from "../src/entries";
import { registryEntrySchema } from "../src/schema";

describe("registry metadata", () => {
  it("validates every entry and keeps names unique", () => {
    registryEntries.forEach((entry) =>
      expect(registryEntrySchema.parse(entry)).toEqual(entry),
    );
    expect(new Set(registryEntries.map((entry) => entry.name)).size).toBe(
      registryEntries.length,
    );
  });
});

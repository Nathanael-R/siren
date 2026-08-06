import { describe, expect, it } from "vitest";
import { registryEntries } from "../../registry/src/entries";

describe("dependency graph", () => {
  it("contains no dependency cycles", () => {
    const byName = new Map(registryEntries.map((entry) => [entry.name, entry]));
    const visit = (name: string, path: string[]) => {
      expect(path).not.toContain(name);
      for (const dependency of byName.get(name)?.registryDependencies ?? [])
        visit(dependency, [...path, name]);
    };
    registryEntries.forEach((entry) => visit(entry.name, []));
  });
});

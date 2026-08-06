import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { add, init, update } from "../src/commands";

let fixture: string;
beforeEach(async () => {
  fixture = await mkdtemp(join(tmpdir(), "siren-cli-test-"));
  await writeFile(
    join(fixture, "package.json"),
    JSON.stringify({ dependencies: { expo: "57.0.11" } }),
  );
});

describe("CLI fixtures", () => {
  it("initializes and resolves registry dependencies", async () => {
    await init(fixture);
    await add(fixture, ["waveform-scrubber"]);
    expect(
      await readFile(join(fixture, "siren/components/waveform.tsx"), "utf8"),
    ).toContain("export const Waveform");
    expect(
      await readFile(join(fixture, ".siren/installed.json"), "utf8"),
    ).toContain("waveform-scrubber");
  });

  it("never overwrites local modifications during update", async () => {
    await init(fixture);
    await add(fixture, ["waveform"]);
    const target = join(fixture, "siren/components/waveform.tsx");
    await writeFile(target, "// local change\n");
    await update(fixture, "waveform");
    expect(await readFile(target, "utf8")).toBe("// local change\n");
    expect(await readFile(`${target}.siren-update`, "utf8")).toContain(
      "export const Waveform",
    );
  });
});

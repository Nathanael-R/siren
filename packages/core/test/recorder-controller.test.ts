import { describe, expect, it, vi } from "vitest";
import { RecorderController } from "../src/recorder-controller";

describe("RecorderController", () => {
  it("enforces transitions and preserves millisecond timing", () => {
    let now = 1000;
    const controller = new RecorderController({
      minimumDurationMs: 200,
      now: () => now,
    });
    controller.start();
    now = 1250;
    controller.pause();
    now = 1400;
    controller.resume();
    now = 1650;
    controller.process();
    const recording = controller.complete({ uri: "file://voice.m4a" });
    expect(recording?.durationMs).toBe(500);
    expect(controller.getSnapshot().state).toBe("preview");
  });

  it("returns a typed short-recording error", () => {
    const controller = new RecorderController({ minimumDurationMs: 300 });
    controller.start();
    controller.process();
    expect(
      controller.complete({ uri: "file://short.m4a", durationMs: 20 }),
    ).toBeUndefined();
    expect(controller.getSnapshot().error?.type).toBe("recording-too-short");
  });

  it("fires the maximum callback once", () => {
    let now = 0;
    const onMaximum = vi.fn();
    const controller = new RecorderController({
      maximumDurationMs: 100,
      now: () => now,
      onMaximumDuration: onMaximum,
    });
    controller.start();
    now = 120;
    controller.tick();
    controller.tick();
    expect(onMaximum).toHaveBeenCalledTimes(1);
  });
});

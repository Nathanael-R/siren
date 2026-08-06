import type {
  RecorderState,
  SirenRecorderError,
  SirenRecording,
} from "./recording";

export type RecorderSnapshot = {
  state: RecorderState;
  durationMs: number;
  recording?: SirenRecording;
  error?: SirenRecorderError;
};

export type RecorderControllerOptions = {
  minimumDurationMs?: number;
  maximumDurationMs?: number;
  now?: () => number;
  onMaximumDuration?: () => void;
};

type Listener = (snapshot: RecorderSnapshot) => void;

const transitions: Record<RecorderState, readonly RecorderState[]> = {
  idle: ["requesting-permission", "recording", "error"],
  "requesting-permission": ["idle", "recording", "error"],
  recording: ["paused", "locked", "processing", "idle", "error"],
  paused: ["recording", "locked", "processing", "idle", "error"],
  locked: ["paused", "recording", "processing", "idle", "error"],
  processing: ["preview", "idle", "error"],
  preview: ["idle", "recording", "error"],
  error: ["idle", "requesting-permission", "recording"],
};

export class RecorderController {
  private snapshot: RecorderSnapshot = { state: "idle", durationMs: 0 };
  private readonly listeners = new Set<Listener>();
  private readonly now: () => number;
  private startedAt?: number;
  private accumulatedMs = 0;
  private maximumTriggered = false;
  readonly minimumDurationMs: number;
  readonly maximumDurationMs?: number;
  private readonly onMaximumDuration?: () => void;

  constructor(options: RecorderControllerOptions = {}) {
    this.minimumDurationMs = Math.max(0, options.minimumDurationMs ?? 300);
    this.maximumDurationMs = options.maximumDurationMs;
    this.now = options.now ?? Date.now;
    this.onMaximumDuration = options.onMaximumDuration;
  }

  getSnapshot = (): RecorderSnapshot => this.snapshot;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  requestPermission(): void {
    this.transition("requesting-permission");
  }

  permissionResolved(
    granted: boolean,
    canOpenSettings = true,
    cause?: unknown,
  ): void {
    if (granted) this.transition("idle");
    else
      this.fail({
        type: "permission-denied",
        recoverable: true,
        canOpenSettings,
        cause,
      });
  }

  start(): void {
    this.accumulatedMs = 0;
    this.startedAt = this.now();
    this.maximumTriggered = false;
    this.transition("recording", {
      durationMs: 0,
      recording: undefined,
      error: undefined,
    });
  }

  pause(): void {
    this.captureElapsed();
    this.transition("paused", { durationMs: this.accumulatedMs });
  }

  resume(): void {
    this.startedAt = this.now();
    this.transition("recording", { durationMs: this.accumulatedMs });
  }

  lock(): void {
    this.transition("locked", { durationMs: this.duration() });
  }

  process(): void {
    this.captureElapsed();
    this.transition("processing", { durationMs: this.accumulatedMs });
  }

  complete(
    recording: Omit<SirenRecording, "durationMs"> & { durationMs?: number },
  ): SirenRecording | undefined {
    const durationMs = recording.durationMs ?? this.accumulatedMs;
    if (durationMs < this.minimumDurationMs) {
      this.fail({
        type: "recording-too-short",
        recoverable: true,
        minimumDurationMs: this.minimumDurationMs,
        actualDurationMs: durationMs,
      });
      return undefined;
    }
    const complete = { ...recording, durationMs };
    this.transition("preview", {
      durationMs,
      recording: complete,
      error: undefined,
    });
    return complete;
  }

  cancel(): void {
    this.startedAt = undefined;
    this.accumulatedMs = 0;
    this.transition("idle", {
      durationMs: 0,
      recording: undefined,
      error: undefined,
    });
  }

  reset(): void {
    if (this.snapshot.state !== "idle")
      this.transition("idle", {
        durationMs: 0,
        recording: undefined,
        error: undefined,
      });
  }

  interrupt(partialUri?: string, cause?: unknown): void {
    this.captureElapsed();
    this.fail({
      type: "recording-interrupted",
      recoverable: true,
      partialUri,
      cause,
    });
  }

  unavailable(cause?: unknown): void {
    this.fail({ type: "audio-unavailable", recoverable: false, cause });
  }

  tick(): number {
    const durationMs = this.duration();
    if (durationMs !== this.snapshot.durationMs)
      this.publish({ ...this.snapshot, durationMs });
    if (
      this.maximumDurationMs !== undefined &&
      durationMs >= this.maximumDurationMs &&
      !this.maximumTriggered
    ) {
      this.maximumTriggered = true;
      this.onMaximumDuration?.();
    }
    return durationMs;
  }

  private duration(): number {
    const active =
      this.startedAt === undefined
        ? 0
        : Math.max(0, this.now() - this.startedAt);
    const duration = this.accumulatedMs + active;
    return this.maximumDurationMs === undefined
      ? duration
      : Math.min(duration, this.maximumDurationMs);
  }

  private captureElapsed(): void {
    this.accumulatedMs = this.duration();
    this.startedAt = undefined;
  }

  private fail(error: SirenRecorderError): void {
    this.startedAt = undefined;
    this.transition("error", { durationMs: this.accumulatedMs, error });
  }

  private transition(
    state: RecorderState,
    patch: Partial<RecorderSnapshot> = {},
  ): void {
    if (!transitions[this.snapshot.state].includes(state)) {
      throw new Error(
        `Invalid recorder transition: ${this.snapshot.state} -> ${state}`,
      );
    }
    this.publish({ ...this.snapshot, ...patch, state });
  }

  private publish(snapshot: RecorderSnapshot): void {
    this.snapshot = snapshot;
    for (const listener of this.listeners) listener(snapshot);
  }
}

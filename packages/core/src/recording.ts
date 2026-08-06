export type RecorderState =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "paused"
  | "locked"
  | "processing"
  | "preview"
  | "error";

export type SirenRecording = {
  uri: string;
  durationMs: number;
  mimeType?: string;
  fileSizeBytes?: number;
  waveform?: readonly number[];
};

export type AgentVisualizerState =
  "idle" | "listening" | "thinking" | "speaking";
export type WaveformSamples = readonly number[];

export type SirenRecorderError =
  | {
      type: "permission-denied";
      recoverable: true;
      canOpenSettings: boolean;
      cause?: unknown;
    }
  | {
      type: "recording-interrupted";
      recoverable: true;
      partialUri?: string;
      cause?: unknown;
    }
  | {
      type: "recording-too-short";
      recoverable: true;
      minimumDurationMs: number;
      actualDurationMs: number;
    }
  | { type: "audio-unavailable"; recoverable: false; cause?: unknown };

export interface WaveformExtractor {
  extract(input: { uri: string; buckets: number }): Promise<readonly number[]>;
}

export interface VoiceNoteRecorderRef {
  start(): Promise<void>;
  stop(): Promise<void>;
  cancel(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
}

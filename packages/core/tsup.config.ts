import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/recording.ts",
    "src/recorder-controller.ts",
    "src/waveform.ts",
    "src/ring-buffer.ts",
    "src/accessibility.ts",
    "src/time.ts",
    "src/warnings.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
});

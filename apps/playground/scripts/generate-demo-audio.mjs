import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const audioDirectory = join(root, "assets", "audio");
const fixturePath = join(root, "data", "demo-audio.generated.ts");
const sampleRate = 22_050;
const bucketCount = 96;

const clips = [
  {
    id: "warm-voice-note",
    fileName: "warm-voice-note.wav",
    title: "Warm voice note",
    description: "A relaxed, speech-shaped memo with natural pauses.",
    durationMs: 6_400,
    baseFrequency: 126,
    brightness: 0.72,
    syllables: [
      [0.2, 0.38, 0.68, -3],
      [0.64, 0.5, 0.92, 1],
      [1.2, 0.32, 0.62, 4],
      [1.62, 0.62, 0.86, -1],
      [2.46, 0.4, 0.72, 2],
      [2.92, 0.7, 1, 5],
      [3.78, 0.34, 0.58, 0],
      [4.18, 0.5, 0.88, -4],
      [4.76, 0.3, 0.54, 2],
      [5.16, 0.74, 0.82, 0],
    ],
  },
  {
    id: "assistant-response",
    fileName: "assistant-response.wav",
    title: "Assistant response",
    description: "A brighter response with quick phrases and a clear finish.",
    durationMs: 7_200,
    baseFrequency: 174,
    brightness: 1,
    syllables: [
      [0.14, 0.28, 0.72, 2],
      [0.48, 0.34, 0.84, 5],
      [0.88, 0.42, 0.94, 1],
      [1.36, 0.28, 0.64, 7],
      [1.72, 0.58, 0.9, 3],
      [2.5, 0.3, 0.66, -1],
      [2.86, 0.38, 0.84, 2],
      [3.3, 0.54, 1, 6],
      [4.04, 0.3, 0.62, 4],
      [4.4, 0.46, 0.86, 0],
      [4.92, 0.34, 0.76, 5],
      [5.34, 0.62, 0.96, 2],
      [6.14, 0.7, 0.82, -2],
    ],
  },
  {
    id: "quick-update",
    fileName: "quick-update.wav",
    title: "Quick update",
    description: "A compact, punchy clip for seeking and replay checks.",
    durationMs: 4_200,
    baseFrequency: 148,
    brightness: 0.86,
    syllables: [
      [0.12, 0.34, 0.82, 4],
      [0.52, 0.44, 1, 7],
      [1.04, 0.28, 0.64, 1],
      [1.42, 0.62, 0.94, -2],
      [2.26, 0.32, 0.7, 5],
      [2.66, 0.42, 0.88, 2],
      [3.18, 0.66, 0.96, -1],
    ],
  },
];

function createClip(config) {
  const frameCount = Math.round((config.durationMs / 1_000) * sampleRate);
  const samples = new Float64Array(frameCount);
  let noiseState = 0x51_52_45_4e;
  for (let index = 0; index < frameCount; index += 1) {
    const time = index / sampleRate;
    let envelope = 0;
    let pitch = 0;
    for (const [start, duration, amplitude, semitones] of config.syllables) {
      const local = (time - start) / duration;
      if (local < 0 || local > 1) continue;
      const shape = Math.sin(Math.PI * local) ** 0.62;
      const candidate = amplitude * shape;
      if (candidate > envelope) {
        envelope = candidate;
        pitch = semitones;
      }
    }
    const frequency =
      config.baseFrequency *
      2 ** (pitch / 12) *
      (1 + Math.sin(time * Math.PI * 9.4) * 0.008);
    noiseState = (noiseState * 1_664_525 + 1_013_904_223) >>> 0;
    const noise = noiseState / 0xffff_ffff - 0.5;
    const voiced =
      Math.sin(Math.PI * 2 * frequency * time) * 0.58 +
      Math.sin(Math.PI * 2 * frequency * 2.03 * time + 0.4) *
        0.23 *
        config.brightness +
      Math.sin(Math.PI * 2 * frequency * 3.97 * time + 1.1) *
        0.11 *
        config.brightness;
    samples[index] = Math.max(
      -1,
      Math.min(1, envelope * (voiced + noise * 0.055) * 0.82),
    );
  }
  return samples;
}

function writeWave(path, samples) {
  const dataLength = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataLength);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);
  for (let index = 0; index < samples.length; index += 1) {
    buffer.writeInt16LE(Math.round(samples[index] * 32_767), 44 + index * 2);
  }
  writeFileSync(path, buffer);
}

function waveform(samples) {
  return Array.from({ length: bucketCount }, (_, bucket) => {
    const start = Math.floor((bucket / bucketCount) * samples.length);
    const end = Math.floor(((bucket + 1) / bucketCount) * samples.length);
    let peak = 0;
    for (let index = start; index < end; index += 1) {
      peak = Math.max(peak, Math.abs(samples[index]));
    }
    return Number(Math.max(0.04, Math.min(1, peak / 0.68)).toFixed(3));
  });
}

mkdirSync(audioDirectory, { recursive: true });
mkdirSync(dirname(fixturePath), { recursive: true });

const generated = clips.map((clip) => {
  const samples = createClip(clip);
  writeWave(join(audioDirectory, clip.fileName), samples);
  return { ...clip, waveform: waveform(samples) };
});

const definitions = generated
  .map(
    (clip) => `  {
    id: ${JSON.stringify(clip.id)},
    title: ${JSON.stringify(clip.title)},
    description: ${JSON.stringify(clip.description)},
    source: require(${JSON.stringify(`../assets/audio/${clip.fileName}`)}) as number,
    durationMs: ${clip.durationMs},
    waveform: ${JSON.stringify(clip.waveform)},
  },`,
  )
  .join("\n");

writeFileSync(
  fixturePath,
  `// Generated by pnpm generate:audio. Do not edit by hand.\n` +
    `export type DemoAudioClip = {\n` +
    `  id: string;\n  title: string;\n  description: string;\n` +
    `  source: number;\n  durationMs: number;\n` +
    `  waveform: readonly number[];\n};\n\n` +
    `export const demoAudioClips: readonly DemoAudioClip[] = [\n${definitions}\n];\n`,
);

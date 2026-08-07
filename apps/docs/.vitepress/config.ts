import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Siren",
  description:
    "Native, copy-owned voice and audio components for Expo and React Native",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/introduction" },
      { text: "Components", link: "/components/waveform" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Installation", link: "/installation" },
          { text: "CLI", link: "/cli" },
          { text: "Registry concepts", link: "/registry" },
          { text: "Styling", link: "/styling" },
          { text: "Platform support", link: "/platform-support" },
          { text: "Native configuration", link: "/native-configuration" },
          { text: "Accessibility", link: "/accessibility" },
          { text: "Performance", link: "/performance" },
          { text: "Troubleshooting", link: "/troubleshooting" },
          { text: "Migration", link: "/migration" },
        ],
      },
      {
        text: "Components",
        items: [
          { text: "Waveform", link: "/components/waveform" },
          { text: "LiveWaveform", link: "/components/live-waveform" },
          { text: "WaveformScrubber", link: "/components/waveform-scrubber" },
          { text: "HoldToRecord", link: "/components/hold-to-record" },
          { text: "RecordingTimer", link: "/components/recording-timer" },
          {
            text: "AudioPermissionGate",
            link: "/components/audio-permission-gate",
          },
          {
            text: "VoiceNoteRecorder",
            link: "/components/voice-note-recorder",
          },
          { text: "RecordingPreview", link: "/components/recording-preview" },
          { text: "VoiceNotePlayer", link: "/components/voice-note-player" },
          {
            text: "AudioStatusIndicator",
            link: "/components/audio-status-indicator",
          },
          { text: "AgentVisualizer", link: "/components/agent-visualizer" },
        ],
      },
      {
        text: "Architecture",
        items: [
          { text: "Registry", link: "/architecture/registry" },
          { text: "Audio model", link: "/architecture/audio-model" },
          { text: "Recorder", link: "/architecture/recorder" },
          { text: "Motion", link: "/architecture/motion" },
          { text: "Renderers", link: "/architecture/renderers" },
          { text: "Performance", link: "/architecture/performance" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/siren-ui/siren" },
    ],
  },
});

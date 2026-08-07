import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Siren",
  titleTemplate: ":title · Native voice UI",
  description:
    "Native, copy-owned voice and audio components for Expo and React Native",
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ["meta", { name: "theme-color", content: "#11110f" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Siren — Native voice UI" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Copy-owned waveforms, recording gestures, players, and agent visualizers for Expo and React Native.",
      },
    ],
  ],
  themeConfig: {
    logo: { src: "/logo.svg", alt: "Siren" },
    nav: [
      { text: "Guide", link: "/introduction" },
      { text: "Components", link: "/components/waveform" },
      { text: "Registry", link: "/registry" },
      {
        text: "GitHub",
        link: "https://github.com/Nathanael-R/siren",
      },
    ],
    search: { provider: "local" },
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
      { icon: "github", link: "https://github.com/Nathanael-R/siren" },
    ],
    editLink: {
      pattern: "https://github.com/Nathanael-R/siren/edit/main/apps/docs/:path",
      text: "Edit this page on GitHub",
    },
    outline: { level: [2, 3], label: "On this page" },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Siren is built in the open.",
    },
  },
});

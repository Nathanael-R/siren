<script setup lang="ts">
import { ref } from "vue";
import { withBase } from "vitepress";

const states = ["listening", "thinking", "speaking"] as const;
const activeState = ref<(typeof states)[number]>("speaking");
const copied = ref(false);
const command = "pnpm dlx siren-ui add voice-note-recorder";
const bars = [
  22, 38, 56, 31, 72, 46, 84, 58, 35, 66, 91, 52, 74, 42, 63, 28, 78, 49, 87,
  57, 33, 69, 45, 76, 39, 61, 25,
];

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(command);
  } catch {
    const input = document.createElement("textarea");
    input.value = command;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  copied.value = true;
  window.setTimeout(() => (copied.value = false), 1600);
}
</script>

<template>
  <div class="siren-home">
    <section class="siren-hero" aria-labelledby="siren-title">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-signal" :data-state="activeState" aria-hidden="true">
        <div class="signal-orb">
          <span class="orb-ring orb-ring-one"></span>
          <span class="orb-ring orb-ring-two"></span>
          <span class="orb-core"></span>
        </div>
        <div class="signal-wave">
          <i
            v-for="(height, index) in bars"
            :key="index"
            :style="{
              '--bar-height': `${height}%`,
              '--bar-delay': `${index * -41}ms`,
            }"
          ></i>
        </div>
      </div>

      <div class="hero-content">
        <p class="hero-kicker"><span></span> Native-first voice components</p>
        <h1 id="siren-title">Siren</h1>
        <p class="hero-lede">
          Voice interfaces that feel alive. Copy-owned waveforms, recording
          gestures, players, and agent visualizers for Expo and React Native.
        </p>
        <div class="hero-actions">
          <a
            class="home-button home-button-primary"
            :href="withBase('/installation')"
          >
            Get started <span aria-hidden="true">→</span>
          </a>
          <a
            class="home-button home-button-quiet"
            :href="withBase('/components/waveform')"
          >
            Explore components
          </a>
        </div>
        <div class="hero-command">
          <code>{{ command }}</code>
          <button
            type="button"
            :aria-label="copied ? 'Copied' : 'Copy install command'"
            @click="copyCommand"
          >
            {{ copied ? "Copied" : "Copy" }}
          </button>
        </div>
      </div>

      <div
        class="hero-state-control"
        :data-state="activeState"
        aria-label="Visualizer state preview"
      >
        <button
          v-for="state in states"
          :key="state"
          type="button"
          :aria-pressed="activeState === state"
          @click="activeState = state"
        >
          <span></span>{{ state }}
        </button>
      </div>
    </section>

    <section class="proof-strip" aria-label="Platform and architecture support">
      <span>Expo SDK 56–57</span>
      <span>iOS + Android</span>
      <span>New Architecture</span>
      <span>Expo Go where possible</span>
      <span>MIT licensed</span>
    </section>

    <section
      class="home-section component-section"
      aria-labelledby="components-title"
    >
      <div class="section-intro">
        <p class="section-label">The registry</p>
        <h2 id="components-title">The hard parts of voice UI, ready to own.</h2>
        <p>
          Install readable source into your app. Keep the defaults, reshape the
          visuals, or replace the internals without waiting on a black box.
        </p>
      </div>

      <div class="component-list">
        <a :href="withBase('/components/waveform')">
          <span class="component-index">01</span>
          <span
            ><strong>Waveforms</strong
            ><small>Static, live, dense, and scrubbable audio data</small></span
          >
          <b aria-hidden="true">→</b>
        </a>
        <a :href="withBase('/components/hold-to-record')">
          <span class="component-index">02</span>
          <span
            ><strong>Recording gestures</strong
            ><small
              >Hold, slide to cancel, slide to lock, and haptics</small
            ></span
          >
          <b aria-hidden="true">→</b>
        </a>
        <a :href="withBase('/components/voice-note-player')">
          <span class="component-index">03</span>
          <span
            ><strong>Voice-note playback</strong
            ><small>Seeking, speed, lifecycle states, and cleanup</small></span
          >
          <b aria-hidden="true">→</b>
        </a>
        <a :href="withBase('/components/agent-visualizer')">
          <span class="component-index">04</span>
          <span
            ><strong>Agent visualizers</strong
            ><small
              >Listening, thinking, and speaking with audio energy</small
            ></span
          >
          <b aria-hidden="true">→</b>
        </a>
      </div>
    </section>

    <section
      class="home-section install-section"
      aria-labelledby="install-title"
    >
      <div class="install-copy">
        <p class="section-label">Own the source</p>
        <h2 id="install-title">
          From registry to your codebase in one command.
        </h2>
        <p>
          Siren resolves component relationships, checks native dependencies,
          and prints required configuration. It never silently rewrites your app
          config.
        </p>
        <a class="text-link" :href="withBase('/registry')"
          >How the registry works →</a
        >
      </div>
      <div class="terminal" aria-label="Siren installation example">
        <div class="terminal-bar">
          <span></span><span></span><span></span><b>terminal</b>
        </div>
        <pre><code><em>$</em> pnpm dlx siren-ui init
<span>✓</span> Detected Expo and New Architecture
<span>✓</span> Registry ready

<em>$</em> pnpm dlx siren-ui add voice-note-recorder
<span>✓</span> Added 8 source files
<span>✓</span> Resolved native dependencies
<mark>→</mark> Review microphone permission copy</code></pre>
      </div>
    </section>

    <section
      class="home-section principles-section"
      aria-labelledby="principles-title"
    >
      <div class="section-intro compact">
        <p class="section-label">Built for real devices</p>
        <h2 id="principles-title">Native behavior is the product.</h2>
      </div>
      <div class="principles-grid">
        <article>
          <span>01</span>
          <h3>UI-thread motion</h3>
          <p>
            Gestures, progress, and audio response stay smooth while JavaScript
            is busy.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Truthful audio data</h3>
          <p>
            Normalized amplitude, bounded history, and recorded shapes that
            never fake movement.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Accessible defaults</h3>
          <p>
            Reduced Motion, useful labels, safe touch targets, and state beyond
            color.
          </p>
        </article>
        <article>
          <span>04</span>
          <h3>Measured performance</h3>
          <p>
            Renderer choices follow physical-device evidence, not speculative
            abstractions.
          </p>
        </article>
      </div>
    </section>

    <section class="home-cta">
      <p class="section-label">Start with the waveform</p>
      <h2>Build the voice interface people remember.</h2>
      <div class="hero-actions">
        <a
          class="home-button home-button-primary"
          :href="withBase('/installation')"
          >Install Siren →</a
        >
        <a
          class="home-button home-button-quiet light"
          href="https://github.com/Nathanael-R/siren"
          >View on GitHub</a
        >
      </div>
    </section>
  </div>
</template>

# Siren Product and Technical Specification

**Version:** 0.2  
**Status:** Approved for implementation planning  
**Product:** Siren  
**Primary platforms:** iOS and Android through Expo and React Native  
**Secondary platform:** Web, experimental  
**Architecture requirement:** React Native New Architecture only

---

# 1. Product summary

Siren is a native-first component registry for building voice, audio, and realtime conversational interfaces in Expo and React Native applications.

Siren provides:

- Copy-owned UI components
- Controlled native primitives
- Headless and semi-headless React hooks
- Testable non-React controllers
- Production-shaped composed blocks
- Audio and waveform utilities
- Optional provider integration recipes
- Registry and CLI tooling
- A small shared runtime package

Siren focuses on mobile interaction problems that developers repeatedly rebuild or struggle to solve reliably, including:

- Voice-note recording
- Hold-to-record interactions
- Slide-to-cancel gestures
- Slide-to-lock gestures
- Live and prerecorded waveforms
- Scrubbable waveform playback
- Recording previews
- Audio permission and interruption states
- Voice-message playback
- Agent visualizers
- Realtime voice-session controls

Siren is not a general-purpose React Native UI kit. It does not replace existing native primitives or attempt to become a universal audio SDK.

---

# 2. Product positioning

Siren should be positioned as:

> Native, copy-owned components for voice notes, audio waveforms, agent visualizers, and realtime voice interfaces in Expo and React Native.

Siren borrows the useful ownership and composability principles associated with shadcn-style registries:

- Developers own the installed source
- Components have sensible defaults
- Source is readable and locally editable
- Components are composed from smaller primitives
- The library does not trap applications inside a proprietary styling runtime
- Complete blocks and lower-level primitives coexist

Siren must not imitate a web-specific component architecture or copy another library’s catalogue, visual identity, or implementation.

The core value is:

- Reliable native behavior
- Accessible mobile interactions
- Understandable source code
- Production-shaped architecture
- Good performance under real audio workloads
- Compatibility with existing application design systems

---

# 3. Product boundary

Siren includes:

- Reusable native UI primitives
- Controlled components
- Headless hooks
- Expo-specific convenience hooks
- Framework-independent internal controllers where appropriate
- Production-shaped composed blocks
- Waveform and audio-level utilities
- Registry installation tooling
- A small shared runtime package
- Documentation
- A physical-device playground
- Optional third-party provider recipes

Siren does not include:

- Cloud storage
- File upload infrastructure
- Authentication
- Transcription services
- Realtime transport infrastructure
- Voice-agent backends
- Proprietary audio codecs
- A replacement for `expo-audio`
- A replacement for LiveKit, ElevenLabs, OpenAI Realtime, WebRTC, or similar services
- A general React Native design system
- A universal audio-engine abstraction
- A universal cross-platform UI abstraction

Provider neutrality applies only where it prevents unnecessary vendor lock-in.

Siren remains intentionally designed for Expo and React Native.

---

# 4. Target users

Siren is intended for developers building:

- Messaging applications
- Voice-note interfaces
- AI voice assistants
- Realtime conversational applications
- Transcription products
- Language-learning applications
- Podcast and audio-learning interfaces
- Audio journaling applications
- Customer-support voice experiences
- Internal mobile tools involving voice capture or playback

The primary user is an Expo or React Native developer who wants reliable voice interactions without combining several incomplete, stale, or narrowly scoped packages.

---

# 5. Core product principles

## 5.1 Native equivalents first

Siren must use existing React Native, Expo, and platform APIs where suitable equivalents already exist.

Examples include:

- `Pressable`
- `Text`
- `TextInput`
- `View`
- `FlatList`
- Native accessibility APIs
- Native permission flows
- Native haptics
- Expo audio APIs
- Platform-specific audio-session behavior

Siren should only create a custom abstraction when the ecosystem has a meaningful gap.

## 5.2 Copy-owned source

Visual components and most hooks should be copied into the developer’s project through the Siren registry.

Developers must be able to:

- Read the implementation
- Modify the source
- Remove unnecessary behavior
- Adapt styling
- Replace internal primitives
- Integrate the component into their architecture
- Debug behavior without entering a black-box dependency

## 5.3 Mobile behavior over web parity

Siren must prioritize excellent iOS and Android behavior.

Web support should be implemented only where it does not weaken, distort, or artificially constrain the native interaction.

## 5.4 Small stable APIs

Components should expose a small, behavior-led public API.

Advanced customization should happen through:

- Copied source
- Controlled state
- Meaningful style props
- Stable slots
- Lower-level exported primitives
- Internal modification by the consuming application

Siren should not expose every internal view as public API.

## 5.5 Difficult behavior, not generic UI

Siren should focus on:

- Recording lifecycles
- Gesture thresholds
- Audio metering
- Waveform rendering
- Audio interruptions
- Playback progress
- Realtime voice states
- Performance-safe visual updates

It should not publish generic buttons, modals, sheets, lists, or text fields unless they have specialized voice or audio behavior.

## 5.6 Measurement before optimization

Siren must establish measurable performance baselines before adding speculative micro-optimizations.

The performance workflow is:

1. Measure
2. Identify the actual bottleneck
3. Optimize
4. Re-measure
5. Validate in a production-like build
6. Record the result

Architectural safeguards remain mandatory, but memoization, state splitting, renderer replacement, and other optimizations should be justified by evidence.

---

# 6. Platform support

## 6.1 Official support

Siren v0.1 officially supports:

- iOS
- Android
- Expo development builds
- React Native New Architecture

## 6.2 Experimental support

Web support is experimental.

Every component page must clearly state:

- iOS support
- Android support
- Web support
- Expo Go compatibility
- Development-build requirements
- Additional native configuration requirements

## 6.3 Expo compatibility

Siren should support:

- The latest stable Expo SDK
- The previous stable Expo SDK

Exact versions must be verified and pinned when implementation begins.

## 6.4 Expo Go

Expo Go compatibility is desirable where naturally available, but it is not a product requirement.

Siren must not weaken audio, gesture, animation, visualization, or native configuration behavior merely to remain compatible with Expo Go.

## 6.5 New Architecture

Siren officially supports the React Native New Architecture only.

Compatibility with the legacy architecture is not required and must not shape component APIs, native integration decisions, or dependency selection.

---

# 7. Technology responsibilities

## 7.1 React Native and Expo

Use for:

- Layout
- Text
- Lists
- Press interactions
- Accessibility
- Audio playback
- Audio recording
- Permissions
- File URIs
- Platform configuration
- Audio-session behavior
- Background and foreground app lifecycle handling

## 7.2 Reanimated

Use for:

- Playback progress
- Recording progress
- Audio-level smoothing
- Gesture feedback
- State transitions
- Transcript highlighting
- Visualizer animation
- Waveform progress animation
- UI-thread-driven updates

There must not be a React render for every audio frame.

### Reanimated hot-path rules

High-frequency components must:

- Avoid reading shared values synchronously from the JavaScript runtime in hot paths
- Prefer transforms and opacity over layout-changing animation where appropriate
- Keep worklets short and deterministic
- Minimize crossings between the JavaScript and UI threads
- Memoize gesture definitions when their identity would otherwise change unnecessarily
- Group related visual calculations where practical
- Avoid one animated native view per waveform sample at high densities
- Avoid allocating new large arrays continuously inside animation loops
- Respect reduced-motion preferences

## 7.3 Gesture Handler

Use for:

- Hold-to-record
- Slide-to-cancel
- Slide-to-lock
- Waveform scrubbing
- Long-press interactions
- Drag-based seeking
- Gesture thresholds
- Gesture cancellation
- Advanced waveform navigation where applicable

Gesture definitions should remain stable across renders unless their configuration genuinely changes.

## 7.4 Skia

Use only where it provides a demonstrated rendering or performance benefit.

Likely Skia use cases:

- Dense waveforms
- Advanced waveform masking
- Radial audio visualizers
- Agent visualizers
- Spectra
- High-frequency animated drawing
- Complex gradients
- Path-based rendering
- Metaball or blob effects

Skia must not be required by components that do not need it.

### Renderer-selection rules

Ordinary React Native views may be used when:

- The visible waveform contains a small number of bars
- The component is mostly static
- The measured performance target is met
- No complex masks, paths, or per-frame drawing are required

Skia should be used when:

- The component contains many visible elements
- Many drawing properties update every frame
- Paths, clipping, masks, or complex gradients are required
- View-based rendering fails the measured performance target
- A large number of animated native views would otherwise be required

The public component API must not depend on which renderer is selected internally.

---

# 8. Distribution model

Siren uses a hybrid distribution model.

## 8.1 Registry

Components, hooks, recipes, and blocks are copied into the consumer’s application.

Example:

```bash
npx siren-ui add voice-note-recorder
```

## 8.2 Runtime package

A small runtime package contains stable shared types and utilities.

Provisional package name:

```text
@siren-ui/core
```

The runtime package may include:

- Shared audio types
- Recorder state types
- Typed errors
- Accessibility helpers
- Waveform normalization utilities
- Development warnings
- Shared mathematical utilities
- Stable controller interfaces

The runtime package must not contain:

- Visual components
- Provider SDKs
- Styling systems
- Large animation implementations
- Skia scenes
- Realtime transport infrastructure
- Upload logic
- Audio recording implementations tied directly to Expo

## 8.3 Core package boundaries

`@siren-ui/core` must:

- Be ESM-first
- Publish TypeScript declarations
- Declare `sideEffects: false` where accurate
- Provide explicit subpath exports
- Avoid broad root barrels that eagerly expose unrelated utilities
- Avoid importing React Native unless a utility genuinely requires it
- Keep provider-specific code outside the package
- Keep Skia code outside the package
- Keep Reanimated-specific visual code outside the package
- Include automated packed-size checks
- Include automated import-cost checks
- Maintain a deliberately small dependency graph

Preferred usage:

```ts
import type { SirenRecording } from "@siren-ui/core/recording";
import { normalizeAmplitude } from "@siren-ui/core/waveform";
```

Avoid forcing consumers to import every utility through one large root module.

## 8.4 Package naming

The product brand is **Siren**.

Package names must remain distinct from unrelated packages using the Siren name.

Provisional names:

```text
CLI: siren-ui
Runtime: @siren-ui/core
```

The exact npm organization and package availability must be verified before publishing.

---

# 9. Registry and CLI behavior

The CLI should read from:

1. A hosted registry
2. A bundled or cached local fallback

The CLI should support:

```bash
npx siren-ui init
npx siren-ui add waveform
npx siren-ui add voice-note-recorder
npx siren-ui diff waveform
npx siren-ui update waveform
```

## 9.1 Installation behavior

The CLI may:

- Detect the package manager
- Copy component files
- Copy hook files
- Copy token files
- Install JavaScript dependencies
- Detect Expo
- Detect NativeWind
- Detect New Architecture configuration
- Detect installed versions of Reanimated, Gesture Handler, Skia, and `expo-audio`
- Detect TypeScript path aliases
- Detect duplicate native dependencies
- Print compatibility warnings
- Print missing native configuration

The CLI must not silently:

- Modify native manifests
- Modify `app.json`
- Modify permission descriptions
- Change Babel configuration
- Change build properties
- Overwrite edited component files
- Perform destructive migrations

Required native configuration should be printed clearly after installation.

## 9.2 Updating copied components

The update flow must:

1. Detect the installed component version
2. Compare local source with the registry version
3. Show local modifications
4. Refuse destructive overwrite by default
5. Support generating a separate updated file
6. Provide migration notes
7. Identify required core-package changes
8. Identify dependency changes

Automatic merging is not required for v0.1.

---

# 10. Repository architecture

Recommended monorepo:

```text
siren/
├── apps/
│   ├── docs/
│   └── playground/
│
├── packages/
│   ├── cli/
│   ├── core/
│   ├── registry/
│   ├── registry-builder/
│   ├── tokens/
│   └── config/
│
├── examples/
│   └── recipes/
│       ├── livekit-agent/
│       ├── elevenlabs-agent/
│       └── openai-realtime/
│
└── tooling/
```

Recommended tooling:

- pnpm workspaces
- Turborepo
- TypeScript
- Expo
- React Native Testing Library
- Jest or the current recommended Expo-compatible test runner
- Maestro
- ESLint
- Prettier
- Changesets or an equivalent release-management tool

## 10.1 Canonical source

The registry source is canonical.

Documentation, the playground, and generated examples should consume generated or copied versions from the registry source.

There must not be separate independent implementations of the same component.

## 10.2 Workspace dependency rules

The monorepo must:

- Maintain one resolved version of React
- Maintain one resolved version of React Native
- Maintain one resolved version of each native dependency
- Maintain one resolved version of Expo native modules where practical
- Explicitly declare every imported dependency
- Avoid relying on accidental hoisting
- Declare native dependencies directly in the playground application
- Detect duplicate versions of React, React Native, Expo Modules, Reanimated, Gesture Handler, Skia, and `expo-audio`
- Run Expo Doctor in CI
- Run dependency validation in CI
- Fail CI when duplicate native dependency versions create unsafe runtime conditions

The project should initially use pnpm’s currently supported workspace dependency layout.

A hoisted layout should only be introduced when a documented native dependency incompatibility requires it.

## 10.3 List-library selection

Use `FlatList` for ordinary bounded lists.

Use FlashList only when:

- The list is expected to be large
- Recycling provides measurable value
- Profiling shows that `FlatList` is insufficient

Siren should not introduce FlashList into a component without a demonstrated requirement.

---

# 11. Styling system

Siren components should be:

> Structurally styled, visually neutral, and designed to become part of the consuming application’s design system.

## 11.1 Structural defaults

Components should include sensible defaults for:

- Layout
- Touch targets
- Gesture areas
- Accessible hit sizes
- Animation timing
- Reduced-motion behavior
- Safe spacing
- Platform ergonomics

## 11.2 Visual defaults

Components should avoid:

- Strong proprietary branding
- A mandatory color palette
- A required theme provider
- A fixed visual identity
- Excessive embedded variants

## 11.3 Styling API

Core registry components should use React Native styles.

They may expose:

- Root `style`
- A small number of meaningful part styles
- Replaceable icons
- Stable slots
- Semantic token imports

Example:

```tsx
<VoiceNotePlayer
  style={styles.root}
  waveformStyle={styles.waveform}
  timeStyle={styles.time}
  slots={{
    PlayIcon: CustomPlayIcon,
  }}
/>
```

Only stable, meaningful component parts should be exposed.

## 11.4 Semantic tokens

Siren may copy a semantic token file into the project.

Example:

```ts
export const sirenTokens = {
  colors: {
    foreground: "#F5F5F5",
    muted: "#8E8E93",
    accent: "#45D6B5",
    destructive: "#FF5A5F",
    surface: "#17181C",
  },
  radius: {
    control: 16,
    pill: 999,
  },
};
```

There should be no mandatory runtime theme provider.

## 11.5 NativeWind

NativeWind remains optional.

Siren may provide separate NativeWind registry variants or recipes.

The core implementation must not require NativeWind or `cssInterop`.

## 11.6 Recipes

Siren may provide separate copyable recipes such as:

- Minimal
- Messaging
- Floating composer
- Full-screen recorder
- Agent call screen
- Voice picker sheet

Recipes should not inflate the base component API.

---

# 12. Public component architecture

Siren should provide three abstraction levels.

## 12.1 Controlled primitives

Examples:

- `HoldToRecord`
- `RecordingTimer`
- `LiveWaveform`
- `WaveformScrubber`
- `AudioPermissionGate`
- `AudioStatusIndicator`

## 12.2 Hooks and controllers

Examples:

- `RecorderController`
- `useVoiceNoteRecorder`
- `useExpoVoiceRecorder`
- `useWaveformSamples`
- `useSmoothedAudioLevel`
- `useAudioPermission`
- `useVoiceNotePlayer`

## 12.3 Composed blocks

Examples:

- `VoiceNoteRecorder`
- `VoiceNotePlayer`
- `RecordingPreview`
- `AgentVisualizer`

Composed blocks must use the same exported primitives rather than maintaining parallel implementations.

---

# 13. v0.1 component scope

The stable v0.1 family should include:

## Waveforms

- `Waveform`
- `LiveWaveform`
- `WaveformScrubber`

## Recorder primitives

- `HoldToRecord`
- `RecordingTimer`
- Slide-to-cancel behavior
- Slide-to-lock behavior

These behaviors may be implemented within `HoldToRecord` or exposed as reusable internal primitives where useful.

## Recorder blocks

- `VoiceNoteRecorder`
- `RecordingPreview`

## Playback

- `VoiceNotePlayer`

## System states

- `AudioPermissionGate`
- `AudioStatusIndicator`

## Agent visuals

- `AgentVisualizer`

`AgentVisualizer` ships in the initial release because it provides strong demonstration, documentation, launch, and social visibility.

---

# 14. AgentVisualizer

`AgentVisualizer` supports:

```ts
type AgentVisualizerState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking";
```

It accepts normalized audio levels:

```ts
type AgentVisualizerProps = {
  state: AgentVisualizerState;
  inputLevel?: number;
  outputLevel?: number;
  variant?: "orb" | "waveform-field" | "radial-bars";
};
```

The visualizer must not process raw PCM internally.

Audio hooks or provider integrations produce normalized levels.

The initial release should include:

- Orb
- Waveform field
- Radial bars

The public API is behavior-led. Appearance is selected through variants.

The visualizer must include:

- Reduced-motion behavior
- Graceful degradation on slower devices
- Stable rendering during rapid state changes
- Explicit low-performance scenarios in the playground
- Measured renderer selection

---

# 15. Audio integration model

## 15.1 Primary integration

Siren provides first-class support for `expo-audio`.

## 15.2 Other audio engines

Visual components accept controlled data from other engines.

Example:

```tsx
<LiveWaveform samples={customSamples} />
```

Siren must not build a large universal audio-engine abstraction.

## 15.3 File ownership

The recorder hook may manage temporary files during active recording.

After completion, ownership transfers to the consuming application.

```ts
type SirenRecording = {
  uri: string;
  durationMs: number;
  mimeType?: string;
  fileSizeBytes?: number;
  waveform?: readonly number[];
};
```

The consuming application owns:

- Uploading
- Moving
- Persistence
- Retry logic
- Deletion
- Authentication
- Storage integration

## 15.4 Uploading

Siren must not include upload logic.

Examples may demonstrate integration patterns, but uploading remains application-owned.

---

# 16. Recorder architecture

Recorder logic should use:

- A small internal controller
- Public React hooks
- Controlled visual components

Suggested separation:

```text
RecorderController
├── state transitions
├── timing
├── commands
├── file ownership
├── interruption handling
└── recovery

useExpoVoiceRecorder
├── permissions
├── expo-audio lifecycle
├── controller subscription
├── sampling
└── React integration
```

The controller must be testable without mounting React components.

## 16.1 Recorder state

```ts
type RecorderState =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "paused"
  | "locked"
  | "processing"
  | "preview"
  | "error";
```

Siren enforces valid transitions internally without requiring a third-party state-machine runtime.

## 16.2 Imperative API

Imperative refs are allowed where the interaction is inherently imperative.

```ts
type VoiceNoteRecorderRef = {
  start(): Promise<void>;
  stop(): Promise<void>;
  cancel(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
};
```

Declarative and controlled APIs remain preferred.

## 16.3 Permissions

Permission changes are explicit by default.

Hooks must not unexpectedly trigger a native permission dialog.

```ts
useVoiceNoteRecorder({
  requestPermissionOnStart: false,
});
```

## 16.4 Recording duration

All Siren time values use milliseconds.

Examples:

- `durationMs`
- `positionMs`
- `minimumDurationMs`
- `maximumDurationMs`
- `warningThresholdMs`

Maximum duration should support:

- A configurable limit
- A warning threshold
- Automatic completion
- A surfaced callback or state

## 16.5 Short recordings

Siren supports a configurable minimum duration.

Too-short recordings produce a typed rejection rather than being silently discarded.

```ts
{
  type: "recording-too-short";
  minimumDurationMs: number;
  actualDurationMs: number;
}
```

## 16.6 Background recording

Background recording is experimental in v0.1.

It should be documented as an advanced recipe and must not be part of the stable foreground recorder promise.

---

# 17. Waveform data model

Visual waveform components consume normalized amplitude buckets.

```ts
type WaveformSamples = readonly number[];
```

Each value should be between `0` and `1`.

Raw PCM, decibel values, channels, and sample rates must be processed by dedicated hooks or utilities before reaching the visual component.

## 17.1 Supported sources

v0.1 should support:

- Supplied normalized samples
- Live microphone samples
- Playback samples
- Precomputed samples

## 17.2 Existing audio files

Siren should expose a pluggable extraction interface.

```ts
interface WaveformExtractor {
  extract(input: {
    uri: string;
    buckets: number;
  }): Promise<readonly number[]>;
}
```

A first-party offline native extractor is not required for the initial stable release.

## 17.3 Remote URLs

Siren does not need to decode remote URLs directly in v0.1.

Applications may:

- Download files first
- Supply precomputed samples
- Provide a custom extractor

## 17.4 Density

Waveform rendering must automatically derive a bounded visual representation based on:

- Available width
- Bar width
- Gap
- Maximum density
- Pixel ratio

The component must not blindly render every supplied sample.

---

# 18. Error model

Public hooks expose typed discriminated errors.

Example:

```ts
type SirenRecorderError =
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
  | {
      type: "audio-unavailable";
      recoverable: false;
      cause?: unknown;
    };
```

Original causes should be preserved where available.

UI components must not parse error strings to determine behavior.

---

# 19. Recovery behavior

Siren may automatically recover safe cases such as:

- Resubscribing to audio sampling
- Restoring temporary playback state
- Releasing stale resources
- Reinitializing visualizer input
- Recovering from short-lived audio interruptions

Siren must not automatically:

- Re-request denied permissions
- Change the user’s audio route unexpectedly
- Restart a recording the user stopped
- Discard partial recordings
- Upload completed recordings
- Delete completed recordings

---

# 20. Localization and RTL

Siren does not include a full internationalization system.

Components provide neutral English defaults and accept label overrides.

```tsx
<VoiceNoteRecorder
  labels={{
    cancel: "Cancel",
    lock: "Lock",
    send: "Send",
    permissionDenied: "Microphone access is disabled",
  }}
/>
```

Siren should support right-to-left layouts.

Gesture directions should mirror where appropriate.

---

# 21. Accessibility

Accessibility is release-blocking.

Stable components must include:

- VoiceOver support
- TalkBack support
- Accessible labels
- Accessible roles
- Announced recording-state changes
- Adjustable actions for waveform seeking
- Non-gesture alternatives for cancel and lock
- Sufficient touch targets
- Reduced-motion behavior
- Dynamic text support where practical
- High-contrast compatibility
- No information conveyed only through color

Development warnings should identify unsafe configurations where practical.

Examples include:

- Touch targets below safe dimensions
- Missing accessibility labels
- Gesture thresholds that are too short
- Scrubbers that are too thin
- Animations that ignore reduced-motion preferences

---

# 22. Performance requirements

Siren must be designed for real mobile audio workloads.

## 22.1 Mandatory architectural safeguards

Requirements include:

- No React render per audio frame
- Fixed-size ring buffers
- Bounded waveform history
- Automatic sample downsampling
- No unbounded allocation in animation loops
- No continuous creation of large arrays in hot paths
- Shared values for high-frequency visual updates
- Smooth gesture response
- Graceful visual degradation on slower devices
- No unnecessary synchronous JavaScript and UI-thread crossings

## 22.2 Measurement workflow

Each performance-sensitive component requires:

- A documented representative scenario
- A baseline measurement
- A recorded bottleneck
- A documented optimization reason
- A post-change measurement
- Release-build validation
- Regression coverage where practical

Micro-optimizations must not be added solely because they are commonly recommended.

## 22.3 Build configuration

Performance must be measured in:

- Release builds
- Production-like optimized development builds where needed

Development-mode measurements must not be treated as production performance evidence.

## 22.4 Targets

Targets include:

- Sustaining the device refresh rate during normal interaction
- Treating 60 FPS as the minimum baseline on representative mid-range Android hardware
- Testing JavaScript-thread and UI-thread behavior separately
- Verifying gesture responsiveness while the JavaScript thread is temporarily busy
- Recording dropped frames during long-running sessions
- Monitoring memory growth during long-running sessions
- Ensuring waveform history remains bounded
- Ensuring visualizers degrade gracefully under load

Exact timing and memory budgets should be established through measurement during implementation.

---

# 23. Platform-specific behavior

Siren should maintain a shared visual structure while allowing platform-specific behavior.

Examples include:

- Permission recovery wording
- Android back-button behavior
- iOS audio-session interruptions
- Android foreground-service requirements
- Haptic differences
- Audio-route differences
- Background recording configuration
- Native settings links

Siren should feel coherent across platforms without pretending that iOS and Android are identical.

---

# 24. Native modules

Siren should avoid custom native modules in v0.1 unless an essential requirement cannot be implemented using existing Expo and React Native APIs.

When native code becomes necessary:

- Expo Modules API is the default approach
- Swift is used for iOS
- Kotlin is used for Android
- A config plugin must be provided when configuration is required
- Native functionality must support the New Architecture
- Expensive native work must be asynchronous
- Expensive native work must not block the JavaScript or main UI threads
- iOS and Android implementations are both required
- Device tests are required
- The technical reason for adding native code must be documented
- A compatibility boundary or fallback must be documented

A generic React Native native-library scaffold should only be used when Siren later requires a non-Expo-first package architecture.

---

# 25. Sheets, dialogs, and menus

Siren must not require a specific bottom-sheet, modal, or menu library.

Components such as future voice pickers should support:

- Slots
- Render containers
- Callbacks
- Recipes for common libraries

Siren should integrate with the consuming application’s existing sheet and dialog infrastructure.

---

# 26. Testing strategy

Each stable component requires:

- Utility tests
- Controller tests
- State-transition tests
- Hook tests
- React Native Testing Library interaction tests
- Accessibility tests
- Reduced-motion tests
- Visual regression coverage where practical
- Automated device smoke tests
- Physical iOS verification
- Physical Android verification
- Performance scenario verification

Tests should focus on user-observable behavior rather than internal implementation details.

## 26.1 Playground application

A dedicated Expo playground should contain deterministic scenarios.

### Waveform scenarios

- Small sample count
- Large sample count
- Dense sample count
- Live simulated PCM
- Dropped-frame simulation
- Reduced motion
- Extreme dimensions
- Scrubbing
- JavaScript-thread contention
- Long-running bounded history

### Recorder scenarios

- Permission granted
- Permission denied
- Permission permanently blocked
- Slide to cancel
- Slide to lock
- Pause and resume
- Recording interruption
- Maximum duration
- Recording too short
- Preview and discard
- Partial file recovery
- App backgrounding
- Rapid start and stop
- Resource cleanup

### Agent visualizer scenarios

- Idle
- Listening
- Thinking
- Speaking
- Rapid state transitions
- Simulated input levels
- Simulated output levels
- Reduced motion
- Low-performance mode
- JavaScript-thread contention
- Long-running animation

The playground should not require API keys.

## 26.2 Maestro smoke testing

Automated Maestro flows should cover:

- Opening every playground scenario
- Starting and stopping a recording
- Entering preview state
- Playing and pausing a voice note
- Seeking through a waveform
- Switching AgentVisualizer states
- Verifying visible recovery actions
- Verifying important accessibility labels where supported
- Permission approval and rejection where automation permits

## 26.3 Manual device testing

Manual verification must cover:

- Real microphone input
- Bluetooth routing
- Wired headphones where applicable
- Phone-call interruption
- App backgrounding and foregrounding
- Real-device audio latency
- VoiceOver
- TalkBack
- Long-duration memory behavior
- Platform-specific permission recovery
- Low-end or mid-range Android hardware

---

# 27. Continuous integration

CI should include:

- Type checking
- Linting
- Unit tests
- Component tests
- Registry schema validation
- Registry generation validation
- Package build verification
- Packed-size checks
- Export-map validation
- Expo Doctor
- Duplicate native dependency detection
- Dependency declaration validation
- Playground build validation
- Documentation build validation
- Changeset validation
- Maestro smoke tests where infrastructure permits

CI should fail when:

- Multiple unsafe versions of React Native dependencies are resolved
- A registry component imports an undeclared dependency
- A component registry entry references missing files
- A package export is invalid
- A generated registry differs from committed output
- A stable component lacks required documentation or tests

---

# 28. Documentation

Siren should have:

- Web documentation
- A dedicated Expo playground
- Component pages
- Installation guides
- Native configuration guides
- Platform notes
- Recipes
- API references
- Failure-state examples
- Accessibility notes
- Performance notes
- Migration guides

Each component page should include:

- Visual preview
- Installation command
- Dependencies
- Platform support
- Expo Go compatibility
- Development-build requirements
- Native configuration
- API reference
- Composition example
- Complete-block example
- Error states
- Permission behavior
- Accessibility
- Performance notes
- Renderer notes where relevant
- iOS notes
- Android notes

Documentation should answer whether a component can survive production mobile use, not merely whether it looks attractive.

---

# 29. Provider recipes

Provider integrations remain isolated from the core library.

Possible recipe folders:

```text
examples/recipes/
├── livekit-agent/
├── elevenlabs-agent/
└── openai-realtime/
```

Provider recipes may demonstrate:

- Mapping provider state to Siren props
- Input and output audio levels
- Connection state
- Interruption
- Mute behavior
- Reconnect behavior

The main playground must use deterministic simulated data.

Provider recipes must not shape the base visual component API unnecessarily.

---

# 30. Versioning

Siren should use:

- Semantic versions for packages
- Per-component registry versions
- Compatibility metadata

Example registry entry:

```json
{
  "name": "voice-note-recorder",
  "version": "0.3.0",
  "requiresCore": "^0.2.0"
}
```

## 30.1 Breaking changes

Breaking changes to copied components require:

- Migration notes
- Before-and-after examples
- The reason for the change
- Manual migration steps
- Diff guidance
- Safe codemods only where appropriate

## 30.2 Experimental components

Experimental components may coexist with stable components under a separate registry namespace.

Example:

```bash
npx siren-ui add experimental/frequency-field
```

Experimental status must be visible in:

- Registry metadata
- Source comments
- Documentation
- Changelog

---

# 31. Community components

The first release should contain official components only.

Community components and recipes may be supported later under a separate namespace.

Community submissions must not automatically inherit Siren’s official support or compatibility guarantees.

---

# 32. License and telemetry

## License

Siren should use the MIT license.

Copied source may be modified and shipped inside proprietary applications.

## Telemetry

The Siren CLI should not include telemetry in v0.1.

Project signals may come from:

- npm downloads
- Registry fetch counts
- Documentation analytics
- GitHub activity
- Issues
- Discussions

---

# 33. Release plan

Siren should use a staged release.

## `0.1.0-alpha.1`

- `Waveform`
- `LiveWaveform`
- `WaveformScrubber`
- `AgentVisualizer`

## `0.1.0-alpha.2`

- `HoldToRecord`
- `RecordingTimer`
- `AudioPermissionGate`

## `0.1.0-beta.1`

- `VoiceNoteRecorder`
- `VoiceNotePlayer`
- `RecordingPreview`
- `AudioStatusIndicator`

## `0.1.0`

- Stable APIs
- Complete documentation
- iOS physical-device verification
- Android physical-device verification
- Accessibility verification
- Performance verification
- Migration notes
- Registry update support
- Dependency duplication checks
- Maestro smoke coverage

The exact sequence may change if implementation dependencies require it, but the first public alpha should remain coherent and visibly useful.

---

# 34. Official registry acceptance criteria

A component may enter the stable official registry only when it has:

- A clear mobile use case
- Evidence that it solves a real ecosystem gap
- A typed API
- Copy-owned source
- No unnecessary replacement of native primitives
- Explicit dependencies
- New Architecture compatibility
- iOS verification
- Android verification
- Accessibility support
- Reduced-motion support
- Failure-state handling
- A documented performance scenario
- Baseline and post-optimization measurements where relevant
- Documentation
- Composition examples
- Tests
- No unnecessary provider lock-in
- No undeclared dependencies
- No unsafe duplicate native dependencies

Visual polish alone is not sufficient.

---

# 35. Codex implementation authority

The implementation prompt must lock:

- Product boundary
- v0.1 components
- Platform targets
- Package structure
- Registry model
- Styling philosophy
- Audio integration model
- Public state types
- Error model
- Accessibility requirements
- Performance measurement workflow
- Testing requirements
- Native-module policy
- Monorepo dependency rules
- Release plan

Codex may independently decide:

- Internal helper names
- Low-level algorithms
- Internal file boundaries
- Test organization
- Small implementation details that do not alter approved contracts
- Minor refactors needed for maintainability
- Renderer selection after profiling, provided the public API remains stable

Codex must not independently:

- Expand Siren into a full voice SDK
- Add upload or storage services
- Introduce a mandatory styling system
- Add unnecessary native modules
- Remove accessibility requirements
- Replace native primitives without justification
- Add provider lock-in
- Change public product boundaries
- Weaken mobile behavior for web parity
- Add large dependencies without documented justification
- Add speculative performance abstractions without measurement
- Introduce multiple incompatible versions of native dependencies
- Rely on undeclared workspace dependencies

Substantial deviations must be documented clearly in the final implementation report.

---

# 36. Remaining pre-implementation checks

Before implementation begins, verify:

- Final npm organization availability
- Final CLI package name
- Exact supported Expo SDK versions
- Current compatible versions of:
  - React
  - React Native
  - Expo
  - `expo-audio`
  - Reanimated
  - Gesture Handler
  - Skia
- Current Expo testing recommendations
- Current Maestro integration recommendations
- Current monorepo publishing setup
- Current pnpm workspace recommendations for Expo
- Current Changesets compatibility
- Whether any required behavior is blocked by current Expo audio APIs
- Licensing compatibility for all dependencies
- Package export and ESM requirements
- Expo Modules API requirements for future native modules
- Registry hosting and caching strategy

These checks may adjust dependency versions or internal implementation details.

They must not alter the approved product boundary without an explicit product decision.
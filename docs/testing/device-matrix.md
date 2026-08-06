# Manual device matrix

Unchecked means not performed. Record model, OS, build profile, date, and notes when completing a row.

| Verification                                   | iOS physical device | Android physical device | Notes                                  |
| ---------------------------------------------- | ------------------- | ----------------------- | -------------------------------------- |
| Real microphone input and latency              | [ ]                 | [ ]                     | Required before stable                 |
| Mid-range hardware / sustained 60 FPS baseline | N/A                 | [ ]                     | Record JS and UI frames separately     |
| Bluetooth route change                         | [ ]                 | [ ]                     | Disconnect during play and record      |
| Wired headphones where supported               | [ ]                 | [ ]                     | Route and unplug behavior              |
| Phone-call interruption and partial recovery   | [ ]                 | [ ]                     | No silent restart/discard              |
| Background and foreground                      | [ ]                 | [ ]                     | Foreground recorder promise only       |
| VoiceOver / TalkBack                           | [ ] VoiceOver       | [ ] TalkBack            | Labels, adjustable seek, announcements |
| RTL gestures and layout                        | [ ]                 | [ ]                     | Cancel mirrors; vertical lock does not |
| Reduced motion and high contrast               | [ ]                 | [ ]                     | No color-only state                    |
| Long-running memory behavior                   | [ ]                 | [ ]                     | Recorder, player, waveform, visualizer |
| Permission denial and Settings recovery        | [ ]                 | [ ]                     | Include permanent block                |
| Rapid start/stop and cleanup/remount           | [ ]                 | [ ]                     | Inspect stale audio resources          |

No manual device checks have been completed in this repository build.

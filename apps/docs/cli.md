# CLI usage

- `siren-ui init` creates non-destructive project configuration.
- `siren-ui list` shows available and installed entries.
- `siren-ui add <name>` resolves registry dependencies and copies source.
- `siren-ui diff <name>` identifies current, updated, modified, or missing files.
- `siren-ui update <name>` updates untouched files and writes `.siren-update` beside locally modified files.

Set `registryUrl` in `siren.json` to use hosted metadata. A bundled fallback is always available. Installed versions and hashes live in `.siren/installed.json`.

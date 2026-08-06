# ADR 002: canonical registry source

**Status:** Accepted

Component and hook source under `packages/registry/src` is canonical. The registry builder validates metadata, embeds source into static JSON, and copies the same source to the playground and documentation examples. `pnpm generate:check` fails when any generated consumer is stale.

The CLI bundles the static registry for offline use and may prefer a configured hosted registry. Installed metadata stores source hashes and versions so `diff` and `update` can protect local edits without attempting automatic merges.

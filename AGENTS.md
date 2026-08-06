# Siren contributor instructions

Read `docs/product-spec.md` in full before changing product behavior. The specification is authoritative.

- Keep registry source canonical; run `pnpm generate` after registry changes.
- Use milliseconds in public APIs and normalized amplitude values in `[0, 1]`.
- Keep native dependencies directly declared by `apps/playground`.
- Do not add upload, storage, transcription, provider SDKs, or custom native code without an ADR.
- Do not weaken iOS or Android behavior for web parity.
- Record meaningful architectural decisions under `docs/decisions/`.
- Never use a sparkles icon in user interfaces.

# Contributing

Read `AGENTS.md` and `docs/product-spec.md` before changing behavior. Use Node 22.13+ and pnpm 11.16+.

```sh
pnpm install --frozen-lockfile
pnpm generate
pnpm typecheck
pnpm lint
pnpm test
pnpm check
pnpm docs:build
pnpm playground:export
```

Change canonical components only under `packages/registry/src`, add user-observable tests, update component docs, and include a Changeset for publishable packages. Do not mark physical-device checks complete unless performed. Security reports follow `SECURITY.md`.

# Registry architecture

`packages/registry/src` is canonical. Entries declare files, transitive registry dependencies, package dependencies, peer ranges, platform support, Expo Go/development-build status, and native configuration. The builder validates metadata and hashes source into deterministic JSON. It copies the same source into the playground and docs examples.

The CLI prefers configured hosted JSON, falls back to bundled JSON, and records installed versions/hashes. Add refuses existing modified targets. Diff classifies files. Update replaces only files unchanged since install; edited files receive a `.siren-update` sibling for manual migration.

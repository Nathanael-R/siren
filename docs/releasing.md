# Releasing

Changesets manages package versions and changelogs. Run `pnpm changeset`, merge reviewed changes, run `pnpm changeset version`, verify the entire matrix, then use `pnpm -r publish --access public` from an authenticated environment. The workflow template prepares artifacts but contains no npm credentials or automatic publish step.

The staged prerelease plan is alpha.1 waveforms/visualizer, alpha.2 recorder primitives, beta.1 composed recorder/player blocks, then stable after device, accessibility, performance, docs, migration, CLI update, and Maestro gates pass.

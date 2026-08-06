# Registry concepts

Each entry declares copied files, registry dependencies, JavaScript dependencies, peer constraints, core compatibility, platforms, Expo Go status, development-build requirements, and native configuration. Static JSON is available at `/r/registry.json`.

The source in `packages/registry/src` is canonical. Playground and documentation examples are generated from it, and CI rejects stale output.

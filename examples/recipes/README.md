# Provider-neutral recipes

Provider recipes map external connection state and normalized input/output levels into Siren controlled props. They own transport, authentication, reconnection, and audio-engine lifecycle. Provider SDK dependencies must stay inside a recipe and are intentionally absent from v0.1.

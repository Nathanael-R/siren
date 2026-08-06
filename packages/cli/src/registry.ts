import bundled from "../../registry/generated/registry.json" with { type: "json" };
import type { Registry, RegistryEntry, SirenConfig } from "./types";

export async function loadRegistry(
  config: SirenConfig,
): Promise<{ registry: Registry; source: "hosted" | "bundled" }> {
  if (config.registryUrl) {
    try {
      const response = await fetch(config.registryUrl, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error(`${response.status}`);
      const registry = (await response.json()) as Registry;
      if (registry.schemaVersion !== 1 || !Array.isArray(registry.entries))
        throw new Error("unsupported registry schema");
      return { registry, source: "hosted" };
    } catch (error) {
      process.stderr.write(
        `Hosted registry unavailable; using bundled data (${String(error)}).\n`,
      );
    }
  }
  return { registry: bundled as unknown as Registry, source: "bundled" };
}

export function resolveEntries(
  registry: Registry,
  names: string[],
): RegistryEntry[] {
  const entries = new Map(registry.entries.map((entry) => [entry.name, entry]));
  const resolved: RegistryEntry[] = [];
  const visited = new Set<string>();
  const visit = (name: string) => {
    if (visited.has(name)) return;
    const entry = entries.get(name);
    if (!entry) throw new Error(`Unknown component: ${name}`);
    entry.registryDependencies.forEach(visit);
    visited.add(name);
    resolved.push(entry);
  };
  names.forEach(visit);
  return resolved;
}

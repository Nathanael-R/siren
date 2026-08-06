import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import pc from "picocolors";
import { detectProject } from "./project";
import { loadRegistry, resolveEntries } from "./registry";
import type { InstalledState, RegistryEntry, SirenConfig } from "./types";

const defaultConfig: SirenConfig = { sourceDir: "." };
const hash = (content: string) =>
  createHash("sha256").update(content).digest("hex");
async function readJson<T>(path: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}
async function configFor(root: string) {
  return readJson(join(root, "siren.json"), defaultConfig);
}
async function installedFor(root: string) {
  return readJson<InstalledState>(join(root, ".siren/installed.json"), {
    version: 1,
    components: {},
  });
}
async function saveInstalled(root: string, installed: InstalledState) {
  const path = join(root, ".siren/installed.json");
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(installed, null, 2)}\n`);
}
async function localContent(path: string) {
  try {
    return await readFile(path, "utf8");
  } catch {
    return undefined;
  }
}

export async function init(root: string) {
  const path = join(root, "siren.json");
  if (await localContent(path))
    throw new Error("siren.json already exists; refusing to overwrite it.");
  const project = await detectProject(root);
  await writeFile(path, `${JSON.stringify(defaultConfig, null, 2)}\n`);
  process.stdout.write(
    `Initialized Siren for ${project.framework} using ${project.packageManager}. New Architecture: ${project.newArchitecture ? "enabled" : "disabled"}.\n`,
  );
}

function printRequirements(entries: RegistryEntry[]) {
  const dependencies = new Set(entries.flatMap((entry) => entry.dependencies));
  if (dependencies.size)
    process.stdout.write(`Dependencies: ${[...dependencies].join(", ")}\n`);
  for (const requirement of new Set(
    entries.flatMap((entry) => entry.nativeConfiguration),
  ))
    process.stdout.write(
      `${pc.yellow("Native configuration:")} ${requirement}\n`,
    );
}

export async function add(root: string, names: string[]) {
  const config = await configFor(root);
  const { registry, source } = await loadRegistry(config);
  const entries = resolveEntries(registry, names);
  const installed = await installedFor(root);
  for (const entry of entries) {
    const files: Record<string, string> = {};
    for (const file of entry.files) {
      const target = join(root, config.sourceDir, file.target);
      const existing = await localContent(target);
      if (existing !== undefined && hash(existing) !== file.hash)
        throw new Error(
          `${file.target} has local content; refusing to overwrite it.`,
        );
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, file.content);
      files[file.target] = file.hash;
    }
    installed.components[entry.name] = { version: entry.version, files };
    process.stdout.write(
      `${pc.green("Added")} ${entry.name}@${entry.version}\n`,
    );
  }
  await saveInstalled(root, installed);
  printRequirements(entries);
  process.stdout.write(
    `Registry source: ${source}. Review native configuration before rebuilding.\n`,
  );
}

export async function diff(root: string, name: string) {
  const config = await configFor(root);
  const { registry } = await loadRegistry(config);
  const [entry] = resolveEntries(registry, [name]).filter(
    (candidate) => candidate.name === name,
  );
  if (!entry) throw new Error(`Unknown component: ${name}`);
  const installed = await installedFor(root);
  const metadata = installed.components[name];
  if (!metadata) throw new Error(`${name} is not installed.`);
  let changed = false;
  for (const file of entry.files) {
    const local = await localContent(join(root, config.sourceDir, file.target));
    const localHash = local === undefined ? "missing" : hash(local);
    const installedHash = metadata.files[file.target];
    const status =
      localHash === file.hash
        ? "current"
        : localHash === installedHash
          ? "registry update available"
          : "locally modified";
    if (status !== "current") changed = true;
    process.stdout.write(`${file.target}: ${status}\n`);
  }
  process.exitCode = changed ? 1 : 0;
}

export async function update(root: string, name: string) {
  const config = await configFor(root);
  const { registry } = await loadRegistry(config);
  const entry = registry.entries.find((candidate) => candidate.name === name);
  if (!entry) throw new Error(`Unknown component: ${name}`);
  const installed = await installedFor(root);
  const metadata = installed.components[name];
  if (!metadata) throw new Error(`${name} is not installed.`);
  const nextFiles: Record<string, string> = {};
  for (const file of entry.files) {
    const target = join(root, config.sourceDir, file.target);
    const local = await localContent(target);
    const modified =
      local !== undefined && hash(local) !== metadata.files[file.target];
    if (modified) {
      const beside = `${target}.siren-update`;
      await writeFile(beside, file.content);
      process.stdout.write(
        `${pc.yellow("Local modifications detected.")} Wrote ${file.target}.siren-update for manual migration.\n`,
      );
      nextFiles[file.target] = metadata.files[file.target] ?? hash(local);
    } else {
      await mkdir(dirname(target), { recursive: true });
      const temporary = `${target}.siren-tmp`;
      await writeFile(temporary, file.content);
      await rename(temporary, target);
      nextFiles[file.target] = file.hash;
      process.stdout.write(`${pc.green("Updated")} ${file.target}\n`);
    }
  }
  installed.components[name] = { version: entry.version, files: nextFiles };
  await saveInstalled(root, installed);
  process.stdout.write(
    `Target ${entry.version}; requires @siren-ui/core ${entry.requiresCore ?? "none"}. Review dependency and migration notes before accepting beside files.\n`,
  );
  printRequirements([entry]);
}

export async function list(root: string) {
  const config = await configFor(root);
  const { registry, source } = await loadRegistry(config);
  const installed = await installedFor(root);
  for (const entry of registry.entries)
    process.stdout.write(
      `${installed.components[entry.name] ? "✓" : " "} ${entry.name.padEnd(32)} ${entry.version.padEnd(18)} ${entry.status}\n`,
    );
  process.stdout.write(`Registry source: ${source}\n`);
}

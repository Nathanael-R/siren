import { createHash } from "node:crypto";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { registryEntries } from "../../registry/src/entries";
import { registryEntrySchema } from "../../registry/src/schema";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");
const sourceRoot = join(root, "packages/registry/src");
const generatedFile = join(root, "packages/registry/generated/registry.json");
const docsRegistry = join(root, "apps/docs/public/r/registry.json");
const consumers = [
  join(root, "apps/playground/siren"),
  join(root, "apps/docs/registry-examples"),
];

export type BundledRegistryFile = {
  path: string;
  target: string;
  type: string;
  hash: string;
  content: string;
};
const hash = (content: string) =>
  createHash("sha256").update(content).digest("hex");

async function buildRegistry() {
  const entries = [];
  for (const rawEntry of registryEntries) {
    const entry = registryEntrySchema.parse(rawEntry);
    const files: BundledRegistryFile[] = [];
    for (const file of entry.files) {
      const content = await readFile(join(sourceRoot, file.path), "utf8");
      files.push({ ...file, content, hash: hash(content) });
    }
    entries.push({ ...entry, files });
  }
  return {
    schemaVersion: 1 as const,
    generatedAt: "1970-01-01T00:00:00.000Z",
    entries,
  };
}

async function writeRegistry(target: string, contents: string) {
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

async function copyCanonical(target: string) {
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  for (const directory of ["components", "hooks", "recipes"])
    await cp(join(sourceRoot, directory), join(target, directory), {
      recursive: true,
    });
}

async function generate(output = generatedFile, copyConsumers = true) {
  const contents = `${JSON.stringify(await buildRegistry(), null, 2)}\n`;
  await writeRegistry(output, contents);
  if (output === generatedFile) await writeRegistry(docsRegistry, contents);
  if (copyConsumers)
    for (const consumer of consumers) await copyCanonical(consumer);
}

async function filesEqual(a: string, b: string): Promise<boolean> {
  try {
    return (await readFile(a, "utf8")) === (await readFile(b, "utf8"));
  } catch {
    return false;
  }
}

async function listFiles(directory: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(directory)) {
    const path = join(directory, entry);
    if ((await stat(path)).isDirectory())
      result.push(...(await listFiles(path)));
    else result.push(path);
  }
  return result;
}

async function check() {
  const temporary = await mkdtemp(join(tmpdir(), "siren-registry-"));
  try {
    const candidate = join(temporary, "registry.json");
    await generate(candidate, false);
    if (
      !(await filesEqual(candidate, generatedFile)) ||
      !(await filesEqual(candidate, docsRegistry))
    )
      throw new Error("Generated registry JSON is stale. Run pnpm generate.");
    for (const consumer of consumers) {
      const canonicalFiles = (await listFiles(sourceRoot)).filter((path) =>
        /[\\/](components|hooks|recipes)[\\/]/.test(path),
      );
      for (const source of canonicalFiles) {
        const target = join(consumer, relative(sourceRoot, source));
        if (!(await filesEqual(source, target)))
          throw new Error(
            `Generated source is stale: ${relative(root, target)}`,
          );
      }
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

async function validate() {
  const registry = await buildRegistry();
  const names = new Set(registry.entries.map((entry) => entry.name));
  for (const entry of registry.entries)
    for (const dependency of entry.registryDependencies)
      if (!names.has(dependency))
        throw new Error(
          `${entry.name} references missing registry dependency ${dependency}`,
        );
  process.stdout.write(
    `Validated ${registry.entries.length} registry entries.\n`,
  );
}

const command = process.argv[2] ?? "generate";
if (command === "generate") await generate();
else if (command === "check") await check();
else if (command === "validate") await validate();
else throw new Error(`Unknown registry-builder command: ${command}`);

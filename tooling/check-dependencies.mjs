import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname.replace(/^\/(.:)/, "$1");
const packageDirs = ["packages", "apps", "examples"];
const builtins = new Set([
  "node:fs",
  "node:fs/promises",
  "node:path",
  "node:url",
  "node:crypto",
  "node:os",
  "node:child_process",
]);
async function files(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (
      [
        "node_modules",
        "dist",
        "generated",
        "registry-examples",
        ".vitepress",
      ].includes(entry.name)
    )
      continue;
    const path = join(dir, entry.name);
    entry.isDirectory()
      ? out.push(...(await files(path)))
      : /\.[cm]?[jt]sx?$/.test(entry.name) && out.push(path);
  }
  return out;
}
function packageName(specifier) {
  if (specifier.startsWith("@"))
    return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/")[0];
}
let failed = false;
for (const group of packageDirs) {
  for (const entry of await readdir(join(root, group), {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    const dir = join(root, group, entry.name);
    let pkg;
    try {
      pkg = JSON.parse(await readFile(join(dir, "package.json"), "utf8"));
    } catch {
      continue;
    }
    const declared = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ]);
    for (const file of await files(dir)) {
      const source = await readFile(file, "utf8");
      for (const match of source.matchAll(
        /(?:from\s+|import\s*\()\s*["']([^"']+)["']/g,
      )) {
        const specifier = match[1];
        if (
          !specifier ||
          specifier.startsWith(".") ||
          specifier.startsWith("@/") ||
          builtins.has(specifier)
        )
          continue;
        const name = packageName(specifier);
        if (!declared.has(name)) {
          failed = true;
          console.error(`${relative(root, file)} imports undeclared ${name}`);
        }
      }
    }
  }
}
if (failed) process.exit(1);
console.log("Imported packages are explicitly declared.");

import { stat } from "node:fs/promises";
import { join } from "node:path";
const root = new URL("../", import.meta.url).pathname.replace(/^\/(.:)/, "$1");
const limits = [
  ["packages/core/dist", 100_000],
  ["packages/cli/dist/cli.js", 800_000],
];
async function size(path) {
  const info = await stat(path);
  if (info.isFile()) return info.size;
  const { readdir } = await import("node:fs/promises");
  let total = 0;
  for (const entry of await readdir(path))
    total += await size(join(path, entry));
  return total;
}
for (const [path, limit] of limits) {
  const bytes = await size(join(root, path));
  if (bytes > limit)
    throw new Error(`${path} is ${bytes} bytes, over ${limit}`);
  console.log(`${path}: ${bytes} bytes`);
}

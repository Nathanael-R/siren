import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
const root = new URL("../", import.meta.url).pathname.replace(/^\/(.:)/, "$1");
for (const directory of ["packages/core", "packages/cli"]) {
  const pkg = JSON.parse(
    await readFile(join(root, directory, "package.json"), "utf8"),
  );
  const targets = directory.endsWith("cli")
    ? Object.values(pkg.bin)
    : Object.values(pkg.exports).flatMap((entry) => [
        entry.import,
        entry.types,
      ]);
  for (const target of targets) await access(join(root, directory, target));
}
console.log("Package export targets exist.");

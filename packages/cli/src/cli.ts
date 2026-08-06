import { resolve } from "node:path";
import { add, diff, init, list, update } from "./commands";

const [command = "help", ...args] = process.argv.slice(2);
const cwdIndex = args.indexOf("--cwd");
const root = resolve(cwdIndex >= 0 ? (args[cwdIndex + 1] ?? ".") : ".");
const values = args.filter(
  (_, index) => index !== cwdIndex && index !== cwdIndex + 1,
);

try {
  if (command === "init") await init(root);
  else if (command === "add" && values.length) await add(root, values);
  else if (command === "diff" && values[0]) await diff(root, values[0]);
  else if (command === "update" && values[0]) await update(root, values[0]);
  else if (command === "list") await list(root);
  else
    process.stdout.write(
      "Usage: siren-ui <init|list|add <component>|diff <component>|update <component>> [--cwd path]\n",
    );
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
}

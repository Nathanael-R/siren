import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
async function json(path: string): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return {};
  }
}

export async function detectProject(root: string) {
  const packageJson = await json(join(root, "package.json"));
  const dependencies = {
    ...(packageJson.dependencies as Record<string, string> | undefined),
    ...(packageJson.devDependencies as Record<string, string> | undefined),
  };
  const appJson = await json(join(root, "app.json"));
  const expoConfig = (appJson.expo ?? appJson) as Record<string, unknown>;
  const tsconfig = await json(join(root, "tsconfig.json"));
  const compilerOptions = tsconfig.compilerOptions as
    Record<string, unknown> | undefined;
  const packageManager = (await exists(join(root, "pnpm-lock.yaml")))
    ? "pnpm"
    : (await exists(join(root, "yarn.lock")))
      ? "yarn"
      : (await exists(join(root, "bun.lock")))
        ? "bun"
        : "npm";
  return {
    framework: dependencies.expo
      ? "expo"
      : dependencies["react-native"]
        ? "react-native"
        : "unknown",
    packageManager,
    nativeWind: !!dependencies.nativewind,
    aliases: (compilerOptions?.paths ?? {}) as Record<string, string[]>,
    newArchitecture: expoConfig.newArchEnabled !== false,
    dependencies,
  };
}

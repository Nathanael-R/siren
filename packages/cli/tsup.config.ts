import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  bundle: true,
  clean: true,
  minify: false,
  banner: { js: "#!/usr/bin/env node" },
});

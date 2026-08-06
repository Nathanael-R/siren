import { execFileSync } from "node:child_process";

const watched = [
  "react",
  "react-native",
  "expo",
  "expo-modules-core",
  "expo-audio",
  "react-native-reanimated",
  "react-native-worklets",
  "react-native-gesture-handler",
  "@shopify/react-native-skia",
];
const executable =
  process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "pnpm";
const args =
  process.platform === "win32"
    ? ["/d", "/s", "/c", "pnpm list -r --depth Infinity --json"]
    : ["list", "-r", "--depth", "Infinity", "--json"];
const output = execFileSync(executable, args, {
  encoding: "utf8",
  maxBuffer: 50 * 1024 * 1024,
});
const projects = JSON.parse(output);
const versions = new Map(watched.map((name) => [name, new Set()]));
function walk(node) {
  if (!node || typeof node !== "object") return;
  for (const [name, value] of Object.entries(node.dependencies ?? {})) {
    if (versions.has(name) && value.version)
      versions.get(name).add(value.version);
    walk(value);
  }
}
projects.forEach(walk);
let failed = false;
for (const [name, found] of versions) {
  if (found.size > 1) {
    failed = true;
    console.error(
      `${name}: unsafe duplicate versions ${[...found].join(", ")}`,
    );
  }
}
if (failed) process.exit(1);
console.log("Native dependency versions are singular.");

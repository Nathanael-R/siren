export type RegistryFile = {
  path: string;
  target: string;
  type: string;
  hash: string;
  content: string;
};
export type RegistryEntry = {
  name: string;
  version: string;
  status: "experimental" | "stable";
  description: string;
  files: RegistryFile[];
  registryDependencies: string[];
  dependencies: string[];
  peerDependencies: Record<string, string>;
  requiresCore?: string;
  platforms: Record<string, string>;
  expoGo: boolean;
  developmentBuildRequired: boolean;
  nativeConfiguration: string[];
};
export type Registry = { schemaVersion: 1; entries: RegistryEntry[] };
export type SirenConfig = { sourceDir: string; registryUrl?: string };
export type InstalledState = {
  version: 1;
  components: Record<
    string,
    { version: string; files: Record<string, string> }
  >;
};

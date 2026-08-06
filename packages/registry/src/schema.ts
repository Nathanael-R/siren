import { z } from "zod";

export const registryFileSchema = z.object({
  path: z.string().min(1),
  type: z.enum(["component", "hook", "utility", "token", "recipe"]),
  target: z.string().min(1),
});

const support = z.enum(["supported", "partial", "experimental", "unsupported"]);

export const registryEntrySchema = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+(?:-[a-z0-9.]+)?$/),
  status: z.enum(["experimental", "stable"]),
  description: z.string().min(10),
  files: z.array(registryFileSchema).min(1),
  registryDependencies: z.array(z.string()),
  dependencies: z.array(z.string()),
  peerDependencies: z.record(z.string(), z.string()),
  requiresCore: z.string().optional(),
  platforms: z.object({ ios: support, android: support, web: support }),
  expoGo: z.boolean(),
  developmentBuildRequired: z.boolean(),
  nativeConfiguration: z.array(z.string()),
});

export type RegistryEntry = z.infer<typeof registryEntrySchema>;
export type RegistryFile = z.infer<typeof registryFileSchema>;

export const registrySchema = z.object({
  schemaVersion: z.literal(1),
  generatedAt: z.string(),
  entries: z.array(registryEntrySchema),
});

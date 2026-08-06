const emitted = new Set<string>();

export function developmentWarning(
  key: string,
  condition: boolean,
  message: string,
): void {
  if (
    condition ||
    typeof process === "undefined" ||
    process.env.NODE_ENV === "production" ||
    emitted.has(key)
  )
    return;
  emitted.add(key);
  console.warn(`[Siren] ${message}`);
}

export function resetDevelopmentWarningsForTests(): void {
  emitted.clear();
}

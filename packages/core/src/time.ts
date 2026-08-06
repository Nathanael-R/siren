export function formatDuration(
  durationMs: number,
  includeHours = false,
): string {
  const seconds = Math.max(0, Math.floor(durationMs / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(remaining).padStart(2, "0");
  return includeHours || hours > 0
    ? `${String(hours).padStart(2, "0")}:${mm}:${ss}`
    : `${mm}:${ss}`;
}

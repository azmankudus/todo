export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const remainingMs = ms % 1000;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const d = Math.floor(h / 24);
  const hPart = h % 24;

  return `${String(d).padStart(2, '0')}:${String(hPart).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(remainingMs).padStart(3, '0')}`;
}

export function calculateClientDuration(startTimeStr: string): string | null {
  try {
    const startTime = new Date(startTimeStr).getTime();
    if (isNaN(startTime)) return null;
    const now = new Date().getTime();
    return formatDuration(now - startTime);
  } catch (e) {
    console.error("Failed to calculate client duration:", e);
    return null;
  }
}

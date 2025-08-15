export function getLocalDateKey(nowInput?: Date | string | number): string {
  const now = nowInput instanceof Date ? new Date(nowInput) : nowInput !== undefined ? new Date(nowInput) : new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const mm = month < 10 ? `0${month}` : String(month);
  const dd = day < 10 ? `0${day}` : String(day);
  return `${year}-${mm}-${dd}`;
}

/**
 * Returns the number of milliseconds until the next local midnight.
 * Uses Date#setHours(24,0,0,0) to advance to the next day's 00:00:00.000 in local time,
 * which correctly handles DST transitions.
 */
export function msUntilNextLocalMidnight(nowInput?: Date | string | number): number {
  const now = nowInput instanceof Date ? new Date(nowInput) : nowInput !== undefined ? new Date(nowInput) : new Date();
  const atNextMidnight = new Date(now);
  // Setting hours to 24 jumps to next day at 00:00 local time
  atNextMidnight.setHours(24, 0, 0, 0);

  const diff = atNextMidnight.getTime() - now.getTime();

  // Guardrails: ensure strictly positive and within 48 hours due to extreme edge cases
  if (diff <= 0) {
    // Fallback: add 24h
    return 24 * 60 * 60 * 1000;
  }
  if (diff > 48 * 60 * 60 * 1000) {
    return 24 * 60 * 60 * 1000;
  }
  return diff;
}



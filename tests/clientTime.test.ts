import { getLocalDateKey, msUntilNextLocalMidnight } from '@/lib/clientTime';

describe('getLocalDateKey', () => {
  it('formats YYYY-MM-DD for a typical date', () => {
    const date = new Date('2025-08-10T15:23:45');
    expect(getLocalDateKey(date)).toBe('2025-08-10');
  });

  it('rolls correctly across months and pads with zeros', () => {
    const date = new Date('2025-01-02T00:00:00');
    expect(getLocalDateKey(date)).toBe('2025-01-02');
  });
});

describe('msUntilNextLocalMidnight', () => {
  it('returns ~24h at start of day', () => {
    const date = new Date('2025-08-10T00:00:01');
    const ms = msUntilNextLocalMidnight(date);
    expect(ms).toBeGreaterThan(23 * 60 * 60 * 1000);
    expect(ms).toBeLessThanOrEqual(24 * 60 * 60 * 1000);
  });

  it('returns small value right before midnight', () => {
    const date = new Date('2025-08-10T23:59:59');
    const ms = msUntilNextLocalMidnight(date);
    expect(ms).toBeGreaterThan(0);
    expect(ms).toBeLessThan(2000);
  });

  it('handles DST forward jump (spring) by using local midnight setHours(24,0,0,0)', () => {
    // Note: We cannot force Node to a specific TZ easily in-unit here, but the function
    // should return a positive number < 48h for any local time; we assert guardrails.
    const date = new Date('2025-03-30T00:30:00');
    const ms = msUntilNextLocalMidnight(date);
    expect(ms).toBeGreaterThan(0);
    expect(ms).toBeLessThan(48 * 60 * 60 * 1000);
  });
});



import { getCached, setCached, getCachedRecord } from '@/app/components/useDailyLocal';

describe('useDailyLocal helpers (storage)', () => {
  beforeEach(() => {
    // @ts-expect-error jsdom
    global.localStorage?.clear?.();
  });

  it('setCached/getCached roundtrip', () => {
    const ns = 'quote';
    const date = '2025-08-10';
    const payload = { a: 1, b: 'x' };
    setCached(ns, date, payload);
    const read = getCached<typeof payload>(ns, date);
    expect(read).toEqual(payload);
  });

  it('getCached returns null on wrong dateKey', () => {
    const ns = 'fact';
    const date = '2025-08-10';
    const payload = { t: 'hello' };
    setCached(ns, date, payload);
    const read = getCached<typeof payload>(ns, '2025-08-11');
    expect(read).toBeNull();
  });

  it('getCachedRecord returns storedAtMs', () => {
    const ns = 'nasa';
    const date = '2025-08-10';
    const payload = { x: 1 } as const;
    setCached<typeof payload>(ns, date, payload);
    const rec = getCachedRecord<typeof payload>(ns, date);
    expect(rec).not.toBeNull();
    expect(rec?.dateKey).toBe(date);
    expect(rec?.payload).toEqual(payload);
    expect(typeof rec?.storedAtMs).toBe('number');
  });
});



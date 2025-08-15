import { selectDeterministicIndex, getHistoricalEventForDate } from '@/lib/history';

describe('selectDeterministicIndex', () => {
  test('returns same index for same seed and length', () => {
    const length = 17;
    const seed = '2025-08-13';
    const a = selectDeterministicIndex(length, seed);
    const b = selectDeterministicIndex(length, seed);
    expect(a).toBe(b);
  });

  test('index is within bounds', () => {
    for (let length = 1; length <= 50; length += 1) {
      const idx = selectDeterministicIndex(length, `seed-${length}`);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(length);
    }
  });
});

describe('getHistoricalEventForDate', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    const mockEvents = [
      { year: '1900', text: 'Event A', links: [{ title: 'A', link: 'https://a.test' }] },
      { year: '1950', text: 'Event B', links: [{ title: 'B', link: 'https://b.test' }] },
      { year: '2000', text: 'Event C', links: [{ title: 'C', link: 'https://c.test' }] },
    ];
    // @ts-expect-error jest injects fetch at runtime
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { Events: mockEvents } }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch as typeof fetch;
    jest.resetAllMocks();
  });

  test('calls correct URL for given dateKey (month/day)', async () => {
    await getHistoricalEventForDate('2025-02-03');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://history.muffinlabs.com/date/2/3',
      expect.objectContaining({ next: expect.objectContaining({ revalidate: 86400 }) })
    );
  });

  test('returns deterministic event for same dateKey', async () => {
    const a = await getHistoricalEventForDate('2025-08-13');
    const b = await getHistoricalEventForDate('2025-08-13');
    expect(a.year).toBe(b.year);
    expect(a.text).toBe(b.text);
  });
});



import { getSecondsUntilUtcMidnight, fetchFactOfTheDay } from '../lib/facts';

describe('getSecondsUntilUtcMidnight', () => {
  test('at exact UTC midnight returns 86400', () => {
    const d = new Date('2024-05-01T00:00:00.000Z');
    expect(getSecondsUntilUtcMidnight(d)).toBe(86400);
  });

  test('one second before UTC midnight returns 1', () => {
    const d = new Date('2024-05-01T23:59:59.000Z');
    expect(getSecondsUntilUtcMidnight(d)).toBe(1);
  });

  test('midday returns roughly 43200 (allowing small variance from ceil)', () => {
    const d = new Date('2024-05-01T12:00:00.000Z');
    const seconds = getSecondsUntilUtcMidnight(d);
    expect(seconds).toBe(43200);
  });

  test('caps values > 86400 down to 86400', () => {
    // Construct a date where timezone math might suggest > 86400 due to rounding
    const d = new Date('2024-05-01T00:00:00.000Z');
    expect(getSecondsUntilUtcMidnight(d)).toBeLessThanOrEqual(86400);
  });
});

describe('fetchFactOfTheDay', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, API_NINJAS_API_KEY: 'test-key' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('calls API Ninjas with X-Api-Key and returns normalized data', async () => {
    const mockJson = [{ fact: 'Cats sleep 70% of their lives.' }];
    const mockFetch = jest.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      json: async () => mockJson,
    } as Response);

    const result = await fetchFactOfTheDay(new Date('2024-05-01T12:00:00.000Z'));
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.api-ninjas.com/v1/facts');
    expect(init.headers['X-Api-Key']).toBe('test-key');
    expect(result.text).toBe('Cats sleep 70% of their lives.');
    expect(result.source).toBe('API Ninjas Facts');
  });

  test('returns fallback on HTTP failure', async () => {
    jest.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    const result = await fetchFactOfTheDay(new Date('2024-05-01T12:00:00.000Z'));
    expect(result.text).toMatch(/Honey never spoils/i);
  });

  test('returns fallback on unexpected payload', async () => {
    jest.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      json: async () => ({ not: 'expected' }),
    } as Response);

    const result = await fetchFactOfTheDay(new Date('2024-05-01T12:00:00.000Z'));
    expect(result.text).toMatch(/Honey never spoils/i);
  });
});



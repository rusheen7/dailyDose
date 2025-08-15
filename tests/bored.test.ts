import { getSecondsUntilUtcMidnight } from '@/lib/facts';
import { fetchActivityOfTheDay, type ActivityData } from '@/lib/bored';

describe('Activity of the Day (Le Wagon Bored API)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  function mockFetchOnce(status: number, body: unknown) {
    const json = async () => body;
    global.fetch = jest.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status, json } as any);
  }

  it('fetches activity and returns normalized data', async () => {
    const payload = {
      activity: 'Go for a nature walk',
      type: 'recreational',
      participants: 1,
      price: 0,
      accessibility: 0.1,
      link: '',
      key: '12345',
    };
    mockFetchOnce(200, payload);

    const now = new Date('2025-08-10T12:00:00.000Z');
    const result = await fetchActivityOfTheDay(now);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('https://bored.api.lewagon.com/api/activity');
    const expectedTtl = getSecondsUntilUtcMidnight(now);
    expect((init as any)?.next?.revalidate).toBe(expectedTtl);

    expect(result).toEqual<ActivityData>({
      activity: 'Go for a nature walk',
      type: 'recreational',
      participants: 1,
      price: 0,
      accessibility: 0.1,
      link: '',
    });
  });

  it('returns fallback on non-OK response', async () => {
    mockFetchOnce(500, { error: 'fail' });
    const result = await fetchActivityOfTheDay(new Date('2025-08-10T12:00:00.000Z'));
    expect(result.activity).toBeTruthy();
    expect(result.type).toBeTruthy();
    expect((result as any)._note).toBe('fallback');
  });

  it('returns fallback on malformed payload', async () => {
    mockFetchOnce(200, { something: 'else' });
    const result = await fetchActivityOfTheDay(new Date('2025-08-10T12:00:00.000Z'));
    expect(result.activity).toBeTruthy();
    expect(result.participants).toBeGreaterThan(0);
  });

  it('accepts payload missing accessibility by defaulting to 0.5', async () => {
    const payload = {
      activity: 'Paint a small artwork',
      type: 'recreational',
      participants: 1,
      price: 0,
      // accessibility omitted
    } as any;
    mockFetchOnce(200, payload);
    const result = await fetchActivityOfTheDay(new Date('2025-08-10T12:00:00.000Z'));
    expect(result.activity).toBe('Paint a small artwork');
    expect(result.accessibility).toBe(0.5);
  });

  it('retries on first failure then succeeds', async () => {
    const first = Promise.resolve({ ok: false, status: 502, json: async () => ({}) } as any);
    const secondPayload = {
      activity: 'Write a short poem',
      type: 'recreational',
      participants: 1,
      price: 0,
      accessibility: 0.2,
    };
    const second = Promise.resolve({ ok: true, status: 200, json: async () => secondPayload } as any);
    (global.fetch as any) = jest.fn().mockImplementationOnce(() => first).mockImplementationOnce(() => second);

    const now = new Date('2025-08-10T12:00:00.000Z');
    const result = await fetchActivityOfTheDay(now);
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe('https://bored.api.lewagon.com/api/activity');
    expect((global.fetch as jest.Mock).mock.calls[1][0]).toBe('https://bored.api.lewagon.com/api/activity');
    expect(result.activity).toBe('Write a short poem');
    expect((result as any)._note).toBeUndefined();
  });
});



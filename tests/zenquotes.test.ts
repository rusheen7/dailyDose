import { fetchQuoteOfTheDay, ZenQuotesError, type NormalizedQuoteOfTheDay } from '@/lib/zenquotes';

describe('fetchQuoteOfTheDay (ZenQuotes)', () => {
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

  it('calls the no-key endpoint by default and maps response', async () => {
    delete process.env.ZENQUOTES_API_KEY;
    const payload = [
      { q: 'Quality means doing it right when no one is looking.', a: 'Henry Ford', h: '<blockquote>…</blockquote>' },
    ];
    mockFetchOnce(200, payload);

    const result = await fetchQuoteOfTheDay();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toBe('https://zenquotes.io/api/today');
    expect(result).toEqual<NormalizedQuoteOfTheDay>({
      content: payload[0].q,
      author: payload[0].a,
      html: payload[0].h,
    });
  });

  it('uses API key when provided', async () => {
    process.env.ZENQUOTES_API_KEY = 'TEST_KEY';
    const payload = [
      { q: 'The important thing is not to stop questioning.', a: 'Albert Einstein' },
    ];
    mockFetchOnce(200, payload);

    const result = await fetchQuoteOfTheDay();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toBe('https://zenquotes.io/api/today/TEST_KEY');
    expect(result.content).toBe('The important thing is not to stop questioning.');
    expect(result.author).toBe('Albert Einstein');
  });

  it('throws on non-OK response', async () => {
    mockFetchOnce(500, { error: 'Internal' });
    await expect(fetchQuoteOfTheDay()).rejects.toBeInstanceOf(ZenQuotesError);
  });

  it('throws on network failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND')) as any;
    await expect(fetchQuoteOfTheDay()).rejects.toBeInstanceOf(ZenQuotesError);
  });

  it('throws on malformed/empty payload', async () => {
    mockFetchOnce(200, []);
    await expect(fetchQuoteOfTheDay()).rejects.toBeInstanceOf(ZenQuotesError);
  });
});



export type NormalizedQuoteOfTheDay = {
  content: string;
  author: string;
  html?: string;
};

type ZenQuotesApiItem = {
  q: string; // quote text
  a: string; // author
  h?: string; // html blockquote
};

class ZenQuotesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZenQuotesError';
  }
}

function buildTodayEndpoint(): string {
  const key = process.env.ZENQUOTES_API_KEY?.trim();
  const base = 'https://zenquotes.io/api/today';
  return key ? `${base}/${encodeURIComponent(key)}` : base;
}

function mapToNormalizedQuote(items: ZenQuotesApiItem[] | null | undefined): NormalizedQuoteOfTheDay {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ZenQuotesError('ZenQuotes returned an empty or invalid payload');
  }
  const first = items[0];
  if (!first || typeof first.q !== 'string' || typeof first.a !== 'string') {
    throw new ZenQuotesError('ZenQuotes payload missing required fields');
  }
  return {
    content: first.q,
    author: first.a,
    html: first.h,
  };
}

/**
 * Fetches Quote of the Day from ZenQuotes.
 * - Uses API key if `process.env.ZENQUOTES_API_KEY` is present.
 * - Applies a 24h revalidate hint for Next.js server-side caching.
 * - Throws `ZenQuotesError` on non-OK responses or malformed payloads.
 */
export async function fetchQuoteOfTheDay(): Promise<NormalizedQuoteOfTheDay> {
  const url = buildTodayEndpoint();

  function secondsUntilNextUtcMidnight(now: Date = new Date()): number {
    const nextMidnightUtc = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0, 0
    ));
    const ms = nextMidnightUtc.getTime() - now.getTime();
    const seconds = Math.max(1, Math.floor(ms / 1000));
    return seconds;
  }

  // The `next` option is a Next.js-specific hint. We keep a permissive type to avoid
  // bringing Next types into this shared lib and to keep Jest tests simple.
  const fetchOptions: RequestInit & { next?: { revalidate?: number } } = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next: { revalidate: secondsUntilNextUtcMidnight() } as any,
  };

  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (err) {
    throw new ZenQuotesError(`Network error calling ZenQuotes: ${(err as Error)?.message ?? 'Unknown error'}`);
  }

  if (!response.ok) {
    throw new ZenQuotesError(`ZenQuotes responded with status ${response.status}`);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new ZenQuotesError('Failed to parse ZenQuotes JSON response');
  }

  return mapToNormalizedQuote(json as ZenQuotesApiItem[]);
}

export { ZenQuotesError };



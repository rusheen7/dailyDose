export function getSecondsUntilUtcMidnight(nowInput?: Date): number {
  const now: Date = nowInput ? new Date(nowInput) : new Date();

  const nextUtcMidnightMs: number = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
    0
  );

  const diffMs: number = nextUtcMidnightMs - now.getTime();

  // Convert to seconds, rounding up so we do not expire earlier than midnight
  const seconds: number = Math.ceil(diffMs / 1000);

  // Guardrails to keep within one day bounds
  if (seconds <= 0) {
    return 86400;
  }
  if (seconds > 86400) {
    return 86400;
  }

  return seconds;
}

export type FactData = {
  text: string;
  source?: string;
  source_url?: string;
};

/**
 * Fetches a single fact from API Ninjas and caches until the next UTC midnight.
 * Optional `nowForTesting` allows tests to control the TTL deterministically.
 */
export async function fetchFactOfTheDay(nowForTesting?: Date): Promise<FactData> {
  const apiKey: string | undefined = process.env.API_NINJAS_API_KEY;

  // Compute TTL aligned to next UTC midnight
  const secondsUntilMidnight: number = getSecondsUntilUtcMidnight(nowForTesting);

  try {
    const response = await fetch('https://api.api-ninjas.com/v1/facts', {
      headers: {
        'X-Api-Key': apiKey ?? '',
      },
      // Next.js data cache revalidation aligned with UTC midnight
      next: { revalidate: secondsUntilMidnight },
    } as RequestInit & { next?: { revalidate: number } });

    if (!response.ok) {
      throw new Error(`Failed to fetch fact: ${response.status}`);
    }

    const json = await response.json();
    // API Ninjas returns an array like: [ { fact: string } ]
    const item = Array.isArray(json) && json.length > 0 ? json[0] : null;
    const factText: string | undefined = item?.fact ?? item?.text ?? undefined;

    if (!factText) {
      throw new Error('Unexpected response shape');
    }

    return {
      text: factText,
      source: 'API Ninjas Facts',
      source_url: 'https://api-ninjas.com/api/facts',
    };
  } catch {
    // Fallback data if API call fails or returns unexpected data
    return {
      text:
        'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!',
      source: 'Daily Dose Facts',
      source_url: '#',
    };
  }
}



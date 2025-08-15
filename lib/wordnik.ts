// Wordnik Word of the Day utilities
// Set your API key in `.env.local` as:
// WORDNIK_API_KEY=your-real-key

export type NormalizedWordOfTheDay = {
  word: string;
  definition?: string;
  partOfSpeech?: string;
  example?: string;
};

type WordnikExample = {
  text?: string;
};

type WordnikDefinition = {
  text?: string;
  partOfSpeech?: string;
  exampleUses?: WordnikExample[]; // This may or may not be present depending on endpoint
};

type WordnikWordOfTheDayResponse = {
  word?: string;
  definitions?: WordnikDefinition[];
  examples?: WordnikExample[]; // Some payloads include a top-level examples array
  note?: string;
  publishDate?: string;
  attributionText?: string;
};

const FALLBACK: NormalizedWordOfTheDay = {
  word: 'serendipity',
  definition:
    'The occurrence and development of events by chance in a happy or beneficial way.',
  partOfSpeech: 'noun',
  example: 'Finding this book was pure serendipity.',
};

export function mapWordnikWordOfTheDayToModel(
  data: WordnikWordOfTheDayResponse | null | undefined
): NormalizedWordOfTheDay | null {
  if (!data || !data.word) return null;

  const firstDefinition = data.definitions?.find(d => Boolean(d?.text));
  const definitionText = firstDefinition?.text?.trim();
  const partOfSpeech = firstDefinition?.partOfSpeech?.trim();

  // Prefer top-level example if present; otherwise, try exampleUses on a definition
  const firstTopLevelExample = data.examples?.find(e => Boolean(e?.text))?.text?.trim();
  const firstDefinitionExample = firstDefinition?.exampleUses?.find(e => Boolean(e?.text))?.text?.trim();
  const exampleText = firstTopLevelExample || firstDefinitionExample;

  return {
    word: data.word,
    definition: definitionText,
    partOfSpeech,
    example: exampleText,
  };
}

export async function fetchWordOfTheDay(
  date?: string
): Promise<WordnikWordOfTheDayResponse> {
  const apiKey = process.env.WORDNIK_API_KEY;
  if (!apiKey) {
    throw new Error(
      'WORDNIK_API_KEY is not set. Add it to your .env.local as WORDNIK_API_KEY=your-real-key'
    );
  }

  const url = new URL('https://api.wordnik.com/v4/words.json/wordOfTheDay');
  if (date) url.searchParams.set('date', date); // YYYY-MM-DD if provided
  url.searchParams.set('api_key', apiKey);

  const response = await fetch(url.toString(), {
    // Cache for 24 hours via Next.js App Router fetch cache
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    const body = await safeReadText(response);
    throw new Error(
      `Wordnik WOTD request failed: ${response.status} ${response.statusText} — ${body}`
    );
  }

  const json = (await response.json()) as WordnikWordOfTheDayResponse;
  return json;
}

export async function getWordnikWordOfTheDayOrFallback(
  date?: string
): Promise<NormalizedWordOfTheDay> {
  try {
    const raw = await fetchWordOfTheDay(date);
    const mapped = mapWordnikWordOfTheDayToModel(raw);
    if (mapped && mapped.word) return mapped;
    return FALLBACK;
  } catch (error) {
    // Do not leak the API key. Log minimal error context.
    console.error('[Wordnik] Failed to fetch Word of the Day:', error);
    return FALLBACK;
  }
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return '';
  }
}



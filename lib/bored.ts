import { getSecondsUntilUtcMidnight } from './facts';

export type ActivityData = {
  activity: string;
  type: string;
  participants: number;
  price: number; // 0..1
  accessibility: number; // 0..1
  link?: string;
};

type BoredApiActivity = {
  activity?: string;
  type?: string;
  participants?: number;
  price?: number;
  accessibility?: number;
  link?: string;
  key?: string | number;
};

const FALLBACK: ActivityData = {
  activity: 'Learn to play a new instrument',
  type: 'music',
  participants: 1,
  price: 0.3,
  accessibility: 0.4,
  link: '',
};

function isValidActivity(payload: BoredApiActivity | null | undefined): payload is BoredApiActivity {
  if (!payload) return false;
  return (
    typeof payload.activity === 'string' &&
    typeof payload.type === 'string' &&
    typeof payload.participants === 'number' &&
    typeof payload.price === 'number'
  );
}

export async function fetchActivityOfTheDay(nowForTesting?: Date): Promise<ActivityData & { _note?: 'fallback' }> {
  const secondsUntilMidnight = getSecondsUntilUtcMidnight(nowForTesting);
  const url = 'https://bored.api.lewagon.com/api/activity';
  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'dailydose/1.0',
    },
    next: { revalidate: secondsUntilMidnight },
  };

  let lastError: unknown = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = (await response.json()) as BoredApiActivity;
      if (!isValidActivity(json)) {
        throw new Error('Unexpected activity payload');
      }
      return {
        activity: json.activity!,
        type: json.type!,
        participants: json.participants!,
        price: json.price!,
        accessibility: typeof json.accessibility === 'number' ? json.accessibility : 0.5,
        link: json.link || '',
      };
    } catch (err) {
      lastError = err;
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 200 + attempt * 100));
      }
    }
  }

  // All attempts failed; return fallback with note
  if (process.env.NODE_ENV !== 'test') {
    // Keep logging concise
    // eslint-disable-next-line no-console
    console.warn('[activity] using fallback after retries:', (lastError as Error)?.message || lastError);
  }
  return { ...FALLBACK, _note: 'fallback' };
}

export { FALLBACK as ACTIVITY_FALLBACK };



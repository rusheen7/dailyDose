export type HistoricalEvent = {
  year: string;
  text: string;
  links: Array<{ title: string; link: string }>;
};

function hashStringToUint32(input: string): number {
  // djb2 variant with xor for better distribution, coerced to uint32
  let hash = 5381 >>> 0;
  for (let index = 0; index < input.length; index += 1) {
    const charCode = input.charCodeAt(index);
    hash = (((hash << 5) + hash) ^ charCode) >>> 0; // hash * 33 ^ c
  }
  return hash >>> 0;
}

export function selectDeterministicIndex(length: number, seed: string): number {
  if (!Number.isFinite(length) || length <= 0) return 0;
  const hash = hashStringToUint32(seed);
  return hash % length;
}

function parseDateKey(dateKey?: string): { year: number; month: number; day: number } {
  if (dateKey) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      return { year, month, day };
    }
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export async function getHistoricalEventForDate(dateKey?: string): Promise<HistoricalEvent> {
  try {
    const { month, day } = parseDateKey(dateKey);
    const url = `https://history.muffinlabs.com/date/${month}/${day}`;
    const response = await fetch(url, { next: { revalidate: 86400 } } as RequestInit & { next?: { revalidate: number } });
    if (!response.ok) throw new Error('Failed to fetch historical events');
    const json = await response.json();
    const events = (json?.data?.Events ?? []) as Array<{ year: string; text: string; links?: Array<{ title: string; link: string }> }>;
    if (!Array.isArray(events) || events.length === 0) throw new Error('No events');

    const seed = dateKey ?? `${new Date().getFullYear()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const index = selectDeterministicIndex(events.length, `historical:${seed}`);
    const chosen = events[index];
    return {
      year: String(chosen.year),
      text: chosen.text,
      links: Array.isArray(chosen.links) ? chosen.links : [],
    };
  } catch {
    return {
      year: '1969',
      text: "Neil Armstrong becomes the first human to walk on the Moon, taking 'one small step for man, one giant leap for mankind.'",
      links: [],
    };
  }
}



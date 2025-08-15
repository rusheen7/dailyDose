export type ApodResponse = {
  date: string;
  explanation: string;
  media_type: 'image' | 'video' | string;
  service_version?: string;
  title: string;
  url: string;
  hdurl?: string;
  thumbnail_url?: string;
  copyright?: string;
};

export class NasaApodError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NasaApodError';
  }
}

/**
 * Fetch NASA Astronomy Picture of the Day (APOD).
 * By default, omits the `date` parameter to avoid timezone-related mismatches and returns the latest APOD.
 * Includes `thumbs=true` so video entries provide a thumbnail where available.
 */
export async function fetchApod(params?: { date?: string; revalidateSeconds?: number }): Promise<ApodResponse> {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const query = new URLSearchParams({ api_key: apiKey, thumbs: 'true' });
  if (params?.date) {
    query.set('date', params.date);
  }

  const url = `https://api.nasa.gov/planetary/apod?${query.toString()}`;

  let response: Response;
  try {
    const fetchInit: RequestInit & { next?: { revalidate?: number } } = params?.revalidateSeconds
      ? ({ next: { revalidate: params.revalidateSeconds } } as unknown as RequestInit & { next?: { revalidate?: number } })
      : ({} as unknown as RequestInit & { next?: { revalidate?: number } });
    response = await fetch(url, fetchInit);
  } catch (err) {
    throw new NasaApodError(`Network error fetching APOD: ${(err as Error).message}`);
  }

  if (!response.ok) {
    throw new NasaApodError(`APOD request failed with status ${response.status}`);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new NasaApodError('Failed to parse APOD response JSON');
  }

  // Basic shape validation
  const parsed = data as Partial<ApodResponse>;
  if (!parsed || typeof parsed !== 'object') {
    throw new NasaApodError('APOD response was not an object');
  }

  if (!parsed.title || !parsed.date || !parsed.explanation || !parsed.media_type) {
    throw new NasaApodError('APOD payload missing required fields');
  }

  if (!parsed.url) {
    throw new NasaApodError('APOD payload missing url');
  }

  return parsed as ApodResponse;
}



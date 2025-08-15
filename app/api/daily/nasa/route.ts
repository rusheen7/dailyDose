import { NextResponse } from 'next/server';
import { fetchApod } from '@/lib/nasa';

export const revalidate = 3600; // modest cache; APOD may post later in the day

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined; // YYYY-MM-DD local date from client

  // Strategy:
  // 1) Try to fetch specific date if provided. If that fails (e.g., not posted yet),
  //    fall back to latest.
  // 2) Return payload with a hint whether the date was exact or a fallback.
  try {
    if (date) {
      try {
        const exact = await fetchApod({ date, revalidateSeconds: 3600 });
        return NextResponse.json({ ...exact, _note: 'exact-date' });
      } catch {
        // Fall through to latest
      }
    }

    const latest = await fetchApod({ revalidateSeconds: 1800 });
    return NextResponse.json({ ...latest, _note: 'latest-fallback' });
  } catch {
    return NextResponse.json(
      {
        date: '1970-01-01',
        title: 'APOD unavailable',
        explanation: 'NASA APOD is currently unavailable. Please try again later.',
        media_type: 'image',
        url: 'https://apod.nasa.gov/apod/image/1901/IC405_Abolfath_3952.jpg',
        _note: 'error-fallback',
      },
      { status: 200 }
    );
  }
}



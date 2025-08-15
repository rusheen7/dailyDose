import { NextResponse } from 'next/server';
import { getHistoricalEventForDate } from '@/lib/history';

export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined; // YYYY-MM-DD

  try {
    const event = await getHistoricalEventForDate(date);
    return NextResponse.json(event);
  } catch {
    return NextResponse.json(
      {
        year: '1969',
        text: "Neil Armstrong becomes the first human to walk on the Moon, taking 'one small step for man, one giant leap for mankind.'",
        links: [],
      },
      { status: 200 }
    );
  }
}



import { NextResponse } from 'next/server';
import { fetchActivityOfTheDay } from '@/lib/bored';

export const revalidate = 86400;

export async function GET() {
  try {
    const data = await fetchActivityOfTheDay();
    return NextResponse.json(data);
  } catch {
    // eslint-disable-next-line no-console
    console.warn('[activity] API route fallback served');
    return NextResponse.json(
      {
        activity: 'Learn to play a new instrument',
        type: 'music',
        participants: 1,
        price: 0.3,
        accessibility: 0.4,
        link: '',
      },
      { status: 200 }
    );
  }
}



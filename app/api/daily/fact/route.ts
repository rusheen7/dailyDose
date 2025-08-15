import { NextResponse } from 'next/server';
import { fetchFactOfTheDay } from '@/lib/facts';

export const revalidate = 86400; // cache per URL (date key) for 24h on server

export async function GET() {
  try {
    const fact = await fetchFactOfTheDay();
    return NextResponse.json(fact);
  } catch {
    return NextResponse.json(
      {
        text: 'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!',
        source: 'Daily Dose Facts',
        source_url: '#',
      },
      { status: 200 }
    );
  }
}



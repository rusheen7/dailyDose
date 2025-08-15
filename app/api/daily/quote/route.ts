import { NextResponse } from 'next/server';
import { fetchQuoteOfTheDay } from '@/lib/zenquotes';

export const revalidate = 86400; // cache per URL (date key) for 24h on server

export async function GET() {
  // We accept ?date=YYYY-MM-DD to key server cache per local day, but the provider
  // does not support date selection. The server response is cached per URL.
  try {
    const data = await fetchQuoteOfTheDay();
    return NextResponse.json({ content: data.content, author: data.author });
  } catch {
    // Provide a simple fallback; keep shape stable
    return NextResponse.json(
      {
        content: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
      },
      { status: 200 }
    );
  }
}



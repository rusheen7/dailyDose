import { NextResponse } from 'next/server';
import { getWordnikWordOfTheDayOrFallback } from '@/lib/wordnik';

export const revalidate = 86400; // cache per URL (date key) for 24h on server

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined;
  try {
    const word = await getWordnikWordOfTheDayOrFallback(date);
    return NextResponse.json(word);
  } catch {
    return NextResponse.json(
      {
        word: 'serendipity',
        definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
        partOfSpeech: 'noun',
        example: 'Finding this book was pure serendipity.',
      },
      { status: 200 }
    );
  }
}



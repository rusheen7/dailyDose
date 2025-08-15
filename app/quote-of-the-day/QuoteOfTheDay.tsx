import { fetchQuoteOfTheDay } from '@/lib/zenquotes';
import DailyHydrator from '@/app/components/DailyHydrator';

async function getQuoteOfTheDay() {
  try {
    const data = await fetchQuoteOfTheDay();
    return { content: data.content, author: data.author };
  } catch (error) {
    console.error('Error fetching quote:', error);
    return {
      content: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
    };
  }
}

export default async function QuoteOfTheDay() {
  const initial = await getQuoteOfTheDay();

  return <DailyHydrator namespace="quote" fetchPath="quote" initialData={initial} />;
}
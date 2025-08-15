import { getWordnikWordOfTheDayOrFallback } from '@/lib/wordnik';
import DailyHydrator from '@/app/components/DailyHydrator';

export default async function WordOfTheDay() {
  const initial = await getWordnikWordOfTheDayOrFallback();

  return <DailyHydrator namespace="word" fetchPath="word" initialData={initial} />;
}
import { fetchFactOfTheDay } from '@/lib/facts';
import DailyHydrator from '@/app/components/DailyHydrator';

export default async function FactOfTheDay() {
  const initial = await fetchFactOfTheDay();

  return <DailyHydrator namespace="fact" fetchPath="fact" initialData={initial} />;
}
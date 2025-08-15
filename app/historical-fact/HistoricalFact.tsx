import DailyHydrator from '@/app/components/DailyHydrator';
import { getHistoricalEventForDate } from '@/lib/history';

export default async function HistoricalFact() {
  const initial = await getHistoricalEventForDate();
  return <DailyHydrator namespace="historical" fetchPath="historical" initialData={initial} />;
}
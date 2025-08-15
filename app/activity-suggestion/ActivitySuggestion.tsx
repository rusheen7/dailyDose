import DailyHydrator from '../components/DailyHydrator';
import { fetchActivityOfTheDay } from '@/lib/bored';

async function getActivitySuggestion() {
  try {
    // Use Le Wagon Bored API with daily revalidation aligned to UTC midnight via lib
    const data = await fetchActivityOfTheDay();
    return data;
  } catch (error) {
    console.error('Error fetching activity:', error);
    // Fallback data
    return {
      activity: "Learn to play a new instrument",
      type: "music",
      participants: 1,
      price: 0.3,
      accessibility: 0.4,
      link: ""
    };
  }
}

// SSR no longer renders its own UI; client hydrator handles iconography

// Remove unused helpers to satisfy linter; client component renders full UI

export default async function ActivitySuggestion() {
  const initial = await getActivitySuggestion();

  return <DailyHydrator namespace="activity-v3" fetchPath="activity" initialData={initial} />;
}
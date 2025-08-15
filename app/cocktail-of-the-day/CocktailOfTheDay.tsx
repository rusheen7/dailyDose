import { fetchCocktailOfTheDay } from '@/lib/cocktails';
import DailyHydrator from '@/app/components/DailyHydrator';

export default async function CocktailOfTheDay() {
  const initial = await fetchCocktailOfTheDay();

  return <DailyHydrator namespace="cocktail" fetchPath="cocktail" initialData={initial} />;
}
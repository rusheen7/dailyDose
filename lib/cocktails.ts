import { getSecondsUntilUtcMidnight } from './facts';

export type NormalizedCocktail = {
  name: string;
  category?: string;
  alcoholic?: string;
  glass?: string;
  instructions?: string;
  image?: string;
  ingredients: Array<{ ingredient: string; measure?: string }>;
};

type CocktailDbDrink = {
  strDrink?: string;
  strCategory?: string;
  strAlcoholic?: string;
  strGlass?: string;
  strInstructions?: string;
  strDrinkThumb?: string;
  [key: string]: unknown;
};

type CocktailDbResponse = {
  drinks?: CocktailDbDrink[];
};

const FALLBACK: NormalizedCocktail = {
  name: 'Mojito',
  category: 'Cocktail',
  alcoholic: 'Alcoholic',
  glass: 'Highball glass',
  instructions:
    'Muddle mint leaves with sugar and lime juice. Add a splash of soda water and fill the glass with cracked ice. Pour the rum and top with soda water. Garnish and serve with straw.',
  image: 'https://www.thecocktaildb.com/images/media/drink/metwgh1606770327.jpg/preview',
  ingredients: [
    { ingredient: 'White rum', measure: '2-3 oz' },
    { ingredient: 'Lime', measure: 'Juice of 1/2' },
    { ingredient: 'Sugar', measure: '2 tsp' },
    { ingredient: 'Mint' },
    { ingredient: 'Soda water', measure: 'Top up' },
  ],
};

export function mapCocktailToModel(raw: CocktailDbDrink | null | undefined): NormalizedCocktail | null {
  if (!raw || !raw.strDrink) return null;

  const ingredients: Array<{ ingredient: string; measure?: string }> = [];
  for (let i = 1; i <= 15; i++) {
    const ing = (raw as Record<string, unknown>)[`strIngredient${i}`];
    const meas = (raw as Record<string, unknown>)[`strMeasure${i}`];
    const ingredient = typeof ing === 'string' ? ing.trim() : '';
    const measure = typeof meas === 'string' ? meas.trim() : undefined;
    if (ingredient) {
      ingredients.push({ ingredient, measure: measure || undefined });
    }
  }

  return {
    name: raw.strDrink,
    category: raw.strCategory?.trim() || undefined,
    alcoholic: raw.strAlcoholic?.trim() || undefined,
    glass: raw.strGlass?.trim() || undefined,
    instructions: raw.strInstructions?.trim() || undefined,
    image: raw.strDrinkThumb?.trim() || undefined,
    ingredients,
  };
}

/**
 * Fetches a random cocktail and caches until next UTC midnight, then maps to normalized model.
 * Accepts an optional `nowForTesting` to make TTL deterministic in tests.
 */
export async function fetchCocktailOfTheDay(nowForTesting?: Date): Promise<NormalizedCocktail> {
  const secondsUntilMidnight = getSecondsUntilUtcMidnight(nowForTesting);

  try {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php', {
      // Next.js cache revalidation aligned with UTC midnight
      next: { revalidate: secondsUntilMidnight },
    } as RequestInit & { next?: { revalidate: number } });

    if (!response.ok) {
      throw new Error(`Failed to fetch cocktail: ${response.status}`);
    }

    const json = (await response.json()) as CocktailDbResponse;
    const first = Array.isArray(json.drinks) && json.drinks.length > 0 ? json.drinks[0] : null;
    const mapped = mapCocktailToModel(first);
    if (mapped) return mapped;
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export { FALLBACK as COCKTAIL_FALLBACK };



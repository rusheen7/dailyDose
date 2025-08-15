import { NextResponse } from 'next/server';
import { fetchCocktailOfTheDay } from '@/lib/cocktails';

export const revalidate = 86400; // cache per URL (date key) for 24h on server

export async function GET() {
  try {
    const cocktail = await fetchCocktailOfTheDay();
    return NextResponse.json(cocktail);
  } catch {
    return NextResponse.json(
      {
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
      },
      { status: 200 }
    );
  }
}



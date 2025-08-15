import { getSecondsUntilUtcMidnight } from '@/lib/facts';
import { mapCocktailToModel, fetchCocktailOfTheDay, type NormalizedCocktail } from '@/lib/cocktails';

describe('Cocktail of the Day', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('mapCocktailToModel', () => {
    it('maps a full cocktail with multiple ingredients and measures', () => {
      const raw = {
        strDrink: 'Margarita',
        strCategory: 'Cocktail',
        strAlcoholic: 'Alcoholic',
        strGlass: 'Cocktail glass',
        strInstructions: 'Shake with ice and strain into glass.',
        strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/wpxpvu1439905379.jpg',
        strIngredient1: 'Tequila',
        strMeasure1: '1 1/2 oz',
        strIngredient2: 'Triple sec',
        strMeasure2: '1/2 oz',
        strIngredient3: 'Lime juice',
        strMeasure3: '1 oz',
        strIngredient4: 'Salt',
        strMeasure4: undefined,
      } as any;

      const mapped = mapCocktailToModel(raw)!;
      expect(mapped.name).toBe('Margarita');
      expect(mapped.category).toBe('Cocktail');
      expect(mapped.alcoholic).toBe('Alcoholic');
      expect(mapped.glass).toBe('Cocktail glass');
      expect(mapped.instructions).toContain('Shake');
      expect(mapped.image).toMatch(/^https:\/\/www\.thecocktaildb\.com\//);
      expect(mapped.ingredients).toEqual([
        { ingredient: 'Tequila', measure: '1 1/2 oz' },
        { ingredient: 'Triple sec', measure: '1/2 oz' },
        { ingredient: 'Lime juice', measure: '1 oz' },
        { ingredient: 'Salt', measure: undefined },
      ]);
    });

    it('returns null when required name is missing', () => {
      const mapped = mapCocktailToModel({} as any);
      expect(mapped).toBeNull();
    });
  });

  describe('fetchCocktailOfTheDay', () => {
    function mockFetchOnce(status: number, body: unknown) {
      const json = async () => body;
      global.fetch = jest.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status, json } as any);
    }

    it('fetches a random cocktail and maps to normalized model', async () => {
      const payload = {
        drinks: [
          {
            strDrink: 'Old Fashioned',
            strCategory: 'Cocktail',
            strAlcoholic: 'Alcoholic',
            strGlass: 'Old-fashioned glass',
            strInstructions: 'Stir with ice, strain.',
            strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/vrwquq1478252802.jpg',
            strIngredient1: 'Bourbon',
            strMeasure1: '4.5 cL',
          },
        ],
      };
      mockFetchOnce(200, payload);

      const result = await fetchCocktailOfTheDay(new Date('2024-05-01T12:00:00.000Z'));
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [, init] = (global.fetch as jest.Mock).mock.calls[0];
      const expectedTtl = getSecondsUntilUtcMidnight(new Date('2024-05-01T12:00:00.000Z'));
      expect((init as any)?.next?.revalidate).toBe(expectedTtl);

      expect(result.name).toBe('Old Fashioned');
      expect(result.ingredients[0].ingredient).toBe('Bourbon');
    });

    it('returns fallback on non-OK response', async () => {
      mockFetchOnce(500, {});
      const result = await fetchCocktailOfTheDay(new Date('2024-05-01T12:00:00.000Z'));
      expect(result.name).toBeTruthy();
      expect(result.ingredients.length).toBeGreaterThan(0);
    });

    it('returns fallback on malformed payload', async () => {
      mockFetchOnce(200, { drinks: [] });
      const result = await fetchCocktailOfTheDay(new Date('2024-05-01T12:00:00.000Z'));
      expect(result.name).toBeTruthy();
      expect(result.instructions).toBeTruthy();
    });
  });
});



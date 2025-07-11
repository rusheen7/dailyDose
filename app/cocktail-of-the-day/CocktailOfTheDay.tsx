async function getCocktailOfTheDay() {
  try {
    // Using TheCocktailDB API for random cocktails
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php', {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cocktail');
    }

    const data = await response.json();
    return data.drinks?.[0];
  } catch (error) {
    console.error('Error fetching cocktail:', error);
    // Fallback data
    return {
      strDrink: "Mojito",
      strCategory: "Cocktail",
      strAlcoholic: "Alcoholic",
      strGlass: "Highball glass",
      strInstructions: "Muddle mint leaves with sugar and lime juice. Add a splash of soda water and fill the glass with cracked ice. Pour the rum and top with soda water. Garnish and serve with straw.",
      strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/metwgh1606770327.jpg/preview",
      strIngredient1: "White rum",
      strIngredient2: "Lime",
      strIngredient3: "Sugar",
      strIngredient4: "Mint",
      strIngredient5: "Soda water",
      strMeasure1: "2-3 oz",
      strMeasure2: "Juice of 1/2",
      strMeasure3: "2 tsp",
      strMeasure4: "2-4",
      strMeasure5: "Top up"
    };
  }
}

export default async function CocktailOfTheDay() {
  const cocktail = await getCocktailOfTheDay();

  // Extract ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`];
    const measure = cocktail[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : 'To taste'
      });
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {cocktail.strDrink}
        </h2>
        <div className="flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{cocktail.strCategory}</span>
          <span>•</span>
          <span>{cocktail.strAlcoholic}</span>
          <span>•</span>
          <span>{cocktail.strGlass}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ingredients
          </h3>
          <div className="space-y-2">
            {ingredients.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">{item.ingredient}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{item.measure}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Instructions
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {cocktail.strInstructions}
          </p>
        </div>
      </div>

      {cocktail.strDrinkThumb && (
        <div className="text-center mb-6">
          <img
            src={cocktail.strDrinkThumb}
            alt={cocktail.strDrink}
            className="w-48 h-48 object-cover rounded-lg mx-auto shadow-lg"
          />
        </div>
      )}

      <div className="text-center">
        <div className="bg-pink-100 dark:bg-pink-900/30 rounded-lg p-4">
          <p className="text-sm text-pink-800 dark:text-pink-200">
            🍹 Remember to drink responsibly and enjoy your cocktail!
          </p>
        </div>
      </div>
    </div>
  );
} 
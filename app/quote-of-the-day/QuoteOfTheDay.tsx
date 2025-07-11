async function getQuoteOfTheDay() {
  try {
    // Using Quotable API for random quotes
    const response = await fetch('https://api.quotable.io/random?maxLength=200', {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    // Fallback data
    return {
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      tags: ["motivation", "success"]
    };
  }
}

export default async function QuoteOfTheDay() {
  const quoteData = await getQuoteOfTheDay();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="mb-8">
          <span className="text-6xl text-purple-400 dark:text-purple-300 mb-4 block">
            "
          </span>
          <p className="text-2xl md:text-3xl text-gray-900 dark:text-white leading-relaxed font-medium mb-6">
            {quoteData.content}
          </p>
          <span className="text-6xl text-purple-400 dark:text-purple-300">
            "
          </span>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-lg text-purple-600 dark:text-purple-400 font-semibold">
            — {quoteData.author}
          </p>
          
          {quoteData.tags && quoteData.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {quoteData.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            💡 Take a moment to reflect on this quote today
          </p>
        </div>
      </div>
    </div>
  );
} 
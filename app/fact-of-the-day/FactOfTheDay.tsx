async function getFactOfTheDay() {
  try {
    // Using Useless Facts API
    const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random', {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fact');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching fact:', error);
    // Fallback data
    return {
      text: "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!",
      source: "Daily Dose Facts",
      source_url: "#"
    };
  }
}

export default async function FactOfTheDay() {
  const factData = await getFactOfTheDay();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <div className="text-6xl mb-6">🧠</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Did You Know?
        </h2>
      </div>

      <div className="mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-l-4 border-green-500">
          <p className="text-xl text-gray-900 dark:text-white leading-relaxed">
            {factData.text}
          </p>
        </div>
      </div>

      {factData.source && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Source: {factData.source}
            {factData.source_url && factData.source_url !== "#" && (
              <a 
                href={factData.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:underline ml-1"
              >
                (Learn more)
              </a>
            )}
          </p>
        </div>
      )}

      <div className="mt-8 text-center">
        <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            💡 Share this fact with a friend and impress them with your knowledge!
          </p>
        </div>
      </div>
    </div>
  );
} 
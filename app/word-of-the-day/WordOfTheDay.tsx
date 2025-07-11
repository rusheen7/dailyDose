async function getWordOfTheDay() {
  try {
    // Using WordsAPI for word of the day
    const response = await fetch('https://wordsapiv1.p.rapidapi.com/words/?random=true', {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error('Failed to fetch word');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching word:', error);
    // Fallback data
    return {
      word: 'serendipity',
      results: [{
        definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
        partOfSpeech: 'noun',
        examples: ['Finding this book was pure serendipity.']
      }]
    };
  }
}

export default async function WordOfTheDay() {
  const wordData = await getWordOfTheDay();
  const word = wordData.word;
  const result = wordData.results?.[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          {word}
        </h2>
        {result?.partOfSpeech && (
          <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium">
            {result.partOfSpeech}
          </span>
        )}
      </div>

      {result?.definition && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Definition
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {result.definition}
          </p>
        </div>
      )}

      {result?.examples && result.examples.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Example Usage
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 italic">
              "{result.examples[0]}"
            </p>
          </div>
        </div>
      )}

      <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          💡 Tip: Try using this word in a conversation today!
        </p>
      </div>
    </div>
  );
} 
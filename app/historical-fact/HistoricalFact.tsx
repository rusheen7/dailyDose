async function getHistoricalFact() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth() returns 0-11
    const day = today.getDate();
    
    // Using Today in History API
    const response = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error('Failed to fetch historical fact');
    }

    const data = await response.json();
    
    // Get a random event from the data
    const events = data.data?.Events || [];
    if (events.length > 0) {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      return {
        year: randomEvent.year,
        text: randomEvent.text,
        links: randomEvent.links || []
      };
    }
    
    throw new Error('No events found');
  } catch (error) {
    console.error('Error fetching historical fact:', error);
    // Fallback data
    return {
      year: "1969",
      text: "Neil Armstrong becomes the first human to walk on the Moon, taking 'one small step for man, one giant leap for mankind.'",
      links: []
    };
  }
}

export default async function HistoricalFact() {
  const historicalData = await getHistoricalFact();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">📜</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          On This Day in History
        </h2>
      </div>

      <div className="mb-8">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border-l-4 border-red-500">
          <div className="text-center mb-4">
            <span className="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-2 rounded-full text-lg font-bold">
              {historicalData.year}
            </span>
          </div>
          <p className="text-xl text-gray-900 dark:text-white leading-relaxed">
            {historicalData.text}
          </p>
        </div>
      </div>

      {historicalData.links && historicalData.links.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Learn More:
          </h3>
          <div className="space-y-2">
            {historicalData.links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            📚 History is full of fascinating moments. Take time to reflect on how far we've come!
          </p>
        </div>
      </div>
    </div>
  );
} 
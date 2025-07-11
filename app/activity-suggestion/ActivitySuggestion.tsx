async function getActivitySuggestion() {
  try {
    // Using BoredAPI for random activities
    const response = await fetch('https://www.boredapi.com/api/activity', {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activity');
    }

    const data = await response.json();
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

function getActivityIcon(type: string) {
  const icons: { [key: string]: string } = {
    education: "📚",
    recreational: "🎮",
    social: "👥",
    diy: "🔧",
    charity: "❤️",
    cooking: "👨‍🍳",
    relaxation: "🧘",
    music: "🎵",
    busywork: "💼"
  };
  return icons[type] || "🎯";
}

function getAccessibilityText(accessibility: number) {
  if (accessibility <= 0.25) return "Very Easy";
  if (accessibility <= 0.5) return "Easy";
  if (accessibility <= 0.75) return "Moderate";
  return "Challenging";
}

function getPriceText(price: number) {
  if (price === 0) return "Free";
  if (price <= 0.3) return "Low Cost";
  if (price <= 0.6) return "Moderate Cost";
  return "Expensive";
}

export default async function ActivitySuggestion() {
  const activity = await getActivitySuggestion();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">
          {getActivityIcon(activity.type)}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {activity.activity}
        </h2>
        <span className="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-4 py-2 rounded-full text-sm font-medium capitalize">
          {activity.type}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">👥</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Participants
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {activity.participants} {activity.participants === 1 ? 'person' : 'people'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">💰</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Cost
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {getPriceText(activity.price)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Difficulty
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {getAccessibilityText(activity.accessibility)}
          </p>
        </div>
      </div>

      {activity.link && (
        <div className="text-center mb-6">
          <a
            href={activity.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Learn More →
          </a>
        </div>
      )}

      <div className="text-center">
        <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-4">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            🎯 Ready to try something new? This activity is perfect for today!
          </p>
        </div>
      </div>
    </div>
  );
} 
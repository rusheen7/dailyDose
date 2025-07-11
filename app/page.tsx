import Link from 'next/link';

export default function Home() {
  const dailyDoses = [
    {
      title: 'Word of the Day',
      description: 'Expand your vocabulary with a new word, its definition, and usage examples',
      icon: '📚',
      href: '/word-of-the-day',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Quote of the Day',
      description: 'Get inspired with a thought-provoking quote from famous personalities',
      icon: '💭',
      href: '/quote-of-the-day',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Fact of the Day',
      description: 'Learn something new with a random useless fact that will amaze you',
      icon: '🧠',
      href: '/fact-of-the-day',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'NASA Picture of the Day',
      description: 'Explore the cosmos with stunning images from NASA\'s Astronomy Picture of the Day',
      icon: '🚀',
      href: '/nasa-picture',
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
    {
      title: 'Cocktail of the Day',
      description: 'Discover a new drink recipe to try and impress your friends',
      icon: '🍸',
      href: '/cocktail-of-the-day',
      color: 'bg-pink-500 hover:bg-pink-600',
    },
    {
      title: 'Activity Suggestion',
      description: 'Beat boredom with a random activity suggestion to try today',
      icon: '🎯',
      href: '/activity-suggestion',
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      title: 'Historical Fact',
      description: 'Travel back in time with an interesting historical fact from this day',
      icon: '📜',
      href: '/historical-fact',
      color: 'bg-red-500 hover:bg-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your Daily Dose of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Amazing Content
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover something new every day with our curated collection of words, quotes, facts, 
            space images, cocktails, activities, and historical moments.
          </p>
        </div>

        {/* Daily Doses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dailyDoses.map((dose) => (
            <Link
              key={dose.href}
              href={dose.href}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className={`${dose.color} p-6 text-white`}>
                  <div className="text-4xl mb-4">{dose.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{dose.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {dose.description}
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Click to explore
                    </span>
                    <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-20 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Daily Dose?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In a world full of information overload, Daily Dose provides you with carefully curated, 
              interesting content that refreshes daily. Each piece of content is designed to inspire, 
              educate, or entertain you in just a few minutes.
            </p>
            <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>🔄 Fresh daily</span>
              <span>⚡ Quick to consume</span>
              <span>🎯 Always interesting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

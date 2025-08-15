import Link from 'next/link';

export default function Home() {
  const dailyDoses = [
    {
      title: 'Word of the Day',
      description: 'Expand your vocabulary with a new word, its definition, and usage examples',
      icon: '📚',
      href: '/word-of-the-day',
    },
    {
      title: 'Quote of the Day',
      description: 'Be inspired with a thought-provoking quote from famous personalities',
      icon: '💭',
      href: '/quote-of-the-day',
    },
    {
      title: 'Fact of the Day',
      description: 'Learn something new with a random fact that will amaze you',
      icon: '🧠',
      href: '/fact-of-the-day',
    },
    {
      title: 'NASA APOD',
      description: 'Explore the cosmos with stunning images from NASA\'s Astronomy Picture of the Day',
      icon: '🚀',
      href: '/nasa-picture',
    },
    {
      title: 'Cocktail of the Day',
      description: 'Discover a new drink recipe to try and impress your friends',
      icon: '🍸',
      href: '/cocktail-of-the-day',
    },
    {
      title: 'Activity of the Day',
      description: 'Beat boredom with a random activity suggestion to try today',
      icon: '🎯',
      href: '/activity-suggestion',
    },
    {
      title: 'Historical Fact of the Day',
      description: 'Travel back in time with an interesting historical fact from this day',
      icon: '📜',
      href: '/historical-fact',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-[clamp(2.25rem,6vw,3.75rem)] leading-tight font-bold text-white mb-6 text-balance">
            Your Daily Dose of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 pb-1">
              Amazing Content
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover something new every day with this curated collection of daily information!
          </p>
        </div>

        {/* Daily Doses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-6">
          {dailyDoses.map((dose) => (
            <Link
              key={dose.href}
              href={dose.href}
              className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-xl"
            >
              <div className="bg-gray-800 h-full flex flex-col rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 overflow-hidden">
                <div className={"bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex-1 transition-colors hover:from-blue-500 hover:to-purple-500"}>
                  <div className="text-4xl mb-4">{dose.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{dose.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {dose.description}
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      Click to explore
                    </span>
                    <span className="text-gray-500 group-hover:text-blue-400 transition-colors">
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
          <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              Why Daily Dose?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              In a world full of information overload, Daily Dose provides you with carefully curated, 
              interesting content that refreshes every single day. Each piece of content is designed to inspire, 
              educate, or entertain you in just a few minutes.
            </p>
            <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-400">
              <span>🔄 New Content Every Day</span>
              <span>⚡ Quick To Consume</span>
              <span>🎯 Always Interesting</span>
            </div>
          </div>
        </div>

        {/* Credit */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Built by <span className="text-blue-400">Rusheen</span>
          </p>
        </div>
      </div>
    </div>
  );
}

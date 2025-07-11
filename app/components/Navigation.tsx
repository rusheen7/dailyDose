'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/word-of-the-day', label: 'Word of the Day', icon: '📚' },
    { href: '/quote-of-the-day', label: 'Quote of the Day', icon: '💭' },
    { href: '/fact-of-the-day', label: 'Fact of the Day', icon: '🧠' },
    { href: '/nasa-picture', label: 'NASA Picture', icon: '🚀' },
    { href: '/cocktail-of-the-day', label: 'Cocktail of the Day', icon: '🍸' },
    { href: '/activity-suggestion', label: 'Activity Suggestion', icon: '🎯' },
    { href: '/historical-fact', label: 'Historical Fact', icon: '📜' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">💊</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Daily Dose
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
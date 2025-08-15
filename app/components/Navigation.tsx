'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/word-of-the-day', label: 'Word of the Day' },
    { href: '/quote-of-the-day', label: 'Quote of the Day' },
    { href: '/fact-of-the-day', label: 'Fact of the Day' },
    { href: '/nasa-picture', label: 'NASA APOD' },
    { href: '/cocktail-of-the-day', label: 'Cocktail of the Day' },
    { href: '/activity-suggestion', label: 'Activity of the Day' },
    { href: '/historical-fact', label: 'Historical Fact of the Day' },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
              <span className="text-2xl"><img src="/favicon.jpg" alt="Daily Dose" className="w-6 h-6" /></span>
              <span className="text-xl font-bold text-white">
                Daily Dose
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    pathname === item.href
                      ? 'bg-blue-900 text-blue-300'
                      : 'text-gray-300 hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 rounded-md text-gray-300 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile disclosure menu */}
        <div
          id="mobile-nav"
          className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-700`}
        >
          <div className="py-2 space-y-1">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-900 text-blue-300'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
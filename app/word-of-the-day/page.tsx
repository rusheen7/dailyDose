import { Suspense } from 'react';
import WordOfTheDay from './WordOfTheDay';

export const metadata = {
  title: 'Word of the Day',
  description: 'Expand your vocabulary with today\'s word, its definition, and usage examples',
};

export default function WordOfTheDayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            📚 Word of the Day
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Expand your vocabulary with today's featured word!
          </p>
        </div>
        
        <Suspense fallback={<WordOfTheDaySkeleton />}>
          <WordOfTheDay />
        </Suspense>
      </div>
    </div>
  );
}

function WordOfTheDaySkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-1/3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-6 w-1/2"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
} 
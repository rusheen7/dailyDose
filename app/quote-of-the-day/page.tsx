import { Suspense } from 'react';
import QuoteOfTheDay from './QuoteOfTheDay';

export const revalidate = 86400; // Revalidate page every 24 hours

export const metadata = {
  title: 'Quote of the Day',
  description: 'Get inspired with today\'s thought-provoking quote from famous personalities',
};

export default function QuoteOfTheDayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            💭 Quote of the Day
          </h1>
          <p className="text-xl text-gray-300">
            Get inspired with today&apos;s thought-provoking quote
          </p>
        </div>
        
        <Suspense fallback={<QuoteSkeleton />}>
          <QuoteOfTheDay />
        </Suspense>
      </div>
    </div>
  );
}

function QuoteSkeleton() {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded mb-6 w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  );
} 
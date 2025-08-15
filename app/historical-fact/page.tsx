import { Suspense } from 'react';
import HistoricalFact from './HistoricalFact';

export const metadata = {
  title: 'Historical Fact - Daily Dose',
  description: 'Travel back in time with an interesting historical fact from this day',
};

export default function HistoricalFactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📜 Historical Fact
          </h1>
          <p className="text-xl text-gray-300">
            Travel back in time with today&apos;s historical moment
          </p>
        </div>
        
        <Suspense fallback={<HistoricalSkeleton />}>
          <HistoricalFact />
        </Suspense>
      </div>
    </div>
  );
}

function HistoricalSkeleton() {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded mb-6 w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
} 
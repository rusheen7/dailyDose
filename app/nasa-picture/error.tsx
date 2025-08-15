'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('APOD Page Error:', error);
  }, [error]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700 max-w-xl w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Unable to load NASA Picture</h2>
        <p className="text-gray-300 mb-6">Please try again in a moment. If the issue persists, check your network connection or API key configuration.</p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
        >
          Retry
        </button>
      </div>
    </div>
  );
}



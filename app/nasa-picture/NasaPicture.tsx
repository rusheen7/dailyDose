import Image from 'next/image';

async function getNasaPicture() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY || 'DEMO_KEY'}&date=${today}`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error('Failed to fetch NASA picture');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching NASA picture:', error);
    // Fallback data
    return {
      title: "The Eagle Nebula",
      date: new Date().toISOString().split('T')[0],
      explanation: "The Eagle Nebula, also known as Messier 16, is a young open cluster of stars in the constellation Serpens. The nebula contains several active star-forming gas and dust regions, including the famous 'Pillars of Creation'.",
      url: "https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg",
      copyright: "NASA"
    };
  }
}

export default async function NasaPicture() {
  const nasaData = await getNasaPicture();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {nasaData.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {new Date(nasaData.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="mb-8">
        <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden">
          <Image
            src={nasaData.url}
            alt={nasaData.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          About This Image
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          {nasaData.explanation}
        </p>
      </div>

      {nasaData.copyright && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          <p>Image Credit: {nasaData.copyright}</p>
        </div>
      )}

      <div className="text-center">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-4">
          <p className="text-sm text-indigo-800 dark:text-indigo-200">
            🌌 Each day, NASA features a different image or photograph of our fascinating universe, 
            along with a brief explanation written by a professional astronomer.
          </p>
        </div>
      </div>
    </div>
  );
} 
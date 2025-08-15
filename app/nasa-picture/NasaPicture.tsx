import { fetchApod, NasaApodError } from '@/lib/nasa';
import DailyHydrator from '@/app/components/DailyHydrator';

async function getNasaPicture() {
  // Let NASA provide the latest APOD by default; use ISR for 24h cache.
  try {
    const data = await fetchApod({ revalidateSeconds: 86400 });
    return data;
  } catch {
    // Provide a lightweight error UI by throwing to page error boundary or returning a minimal fallback shape
    throw new NasaApodError('Unable to load NASA APOD at this time.');
  }
}

// client hydrator handles video rendering

export default async function NasaPicture() {
  let initial: { date: string; title: string; explanation: string; media_type: string; url: string; hdurl?: string; copyright?: string };
  try {
    initial = await getNasaPicture();
  } catch {
    // Provide a non-throwing fallback so build/prerender can succeed; client will hydrate later
    initial = {
      date: new Date().toISOString().slice(0, 10),
      title: 'APOD temporarily unavailable',
      explanation: 'NASA APOD could not be loaded during build. The page will update automatically.',
      media_type: 'image',
      url: 'https://apod.nasa.gov/apod/image/1901/IC405_Abolfath_3952.jpg',
    };
  }

  return <DailyHydrator namespace="nasa" fetchPath="nasa" initialData={initial} />;
}
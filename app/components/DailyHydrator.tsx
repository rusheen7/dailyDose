'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useDailyLocal, { getCachedRecord, setCached } from '@/app/components/useDailyLocal';
import { getLocalDateKey } from '@/lib/clientTime';
import CopyQuoteButton from '@/app/quote-of-the-day/CopyQuoteButton';
import CopyFactButton from '@/app/fact-of-the-day/CopyFactButton';
import CopyExampleButton from '@/app/word-of-the-day/CopyExampleButton';

type FetchPath = 'quote' | 'fact' | 'cocktail' | 'word' | 'nasa' | 'activity' | 'historical';

type DailyHydratorProps = {
  namespace: string;
  fetchPath: FetchPath;
  initialData: unknown;
};

function VideoEmbed({ url, title }: { url: string; title: string }) {
  const isYouTube = /youtube\.com|youtu\.be/.test(url);
  const isVimeo = /vimeo\.com/.test(url);
  if (isYouTube || isVimeo) {
    return (
      <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden bg-black border border-gray-200 dark:border-gray-700 shadow">
        <iframe
          src={url}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="text-center">
      <a className="text-indigo-600 hover:underline" href={url} target="_blank" rel="noreferrer">
        View video: {title}
      </a>
    </div>
  );
}

type DataShape = Record<string, unknown>;

export default function DailyHydrator({ namespace, fetchPath, initialData }: DailyHydratorProps) {
  const [data, setData] = useState<DataShape | null>(() => (initialData as DataShape) ?? null);
  const loadingRef = useRef(false);
  const [lastUpdatedMs, setLastUpdatedMs] = useState<number | null>(null);
  const retryAttemptsRef = useRef<number>(0);
  const hadInitialDataRef = useRef<boolean>(initialData != null);

  async function fetchForDate(dateKey: string) {
    try {
      if (loadingRef.current) return;
      loadingRef.current = true;
      const versionSuffix = fetchPath === 'activity' ? '&v=3' : '';
      const url = `/api/daily/${fetchPath}?date=${encodeURIComponent(dateKey)}${versionSuffix}`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      setCached(namespace, dateKey, json as DataShape);
      setLastUpdatedMs(Date.now());
      setData(json as DataShape);

      const note = (json as { _note?: string } | null | undefined)?._note;
      if (note === 'latest-fallback' && (fetchPath === 'nasa' || fetchPath === 'word')) {
        scheduleRetry();
      } else {
        retryAttemptsRef.current = 0;
      }
    } catch {
      if (fetchPath === 'nasa' || fetchPath === 'word') {
        scheduleRetry();
      }
    } finally {
      loadingRef.current = false;
    }
  }

  function scheduleRetry() {
    const maxAttempts = 24;
    const attempts = retryAttemptsRef.current;
    if (attempts >= maxAttempts) return;
    retryAttemptsRef.current = attempts + 1;
    const baseMs = 15 * 60 * 1000;
    const jitter = Math.floor(Math.random() * 3 * 60 * 1000);
    const delay = baseMs + jitter;
    const retryDateKey = getLocalDateKey();
    window.setTimeout(() => {
      fetchForDate(retryDateKey);
    }, delay);
  }

  const { dateKey } = useDailyLocal({
    onMidnight: () => {
      const newDateKey = getLocalDateKey();
      const record = getCachedRecord(namespace, newDateKey) as { dateKey: string; payload: DataShape; storedAtMs: number } | null;
      if (record) {
        setData(record.payload as DataShape);
        setLastUpdatedMs(record.storedAtMs);
      } else {
        fetchForDate(newDateKey);
      }
    },
  });

  useEffect(() => {
    const record = getCachedRecord(namespace, dateKey) as { dateKey: string; payload: DataShape; storedAtMs: number } | null;
    if (record) {
      if (!hadInitialDataRef.current) {
        setData(record.payload as DataShape);
        setLastUpdatedMs(record.storedAtMs);
        return;
      }
      // We had SSR initialData; prefer it to avoid flicker, but still refresh the cache via network.
      fetchForDate(dateKey);
      return;
    }
    fetchForDate(dateKey);
    // fetchForDate is stable within this component; suppress exhaustive-deps warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace, fetchPath, dateKey]);

  switch (fetchPath) {
    case 'quote': {
      const quoteData = data as { content: string; author: string };
      return (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <div className="text-center">
            <div className="mb-8">
              <p className="text-2xl md:text-3xl text-white leading-relaxed font-medium mb-6 italic">“{quoteData.content}”</p>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-lg text-purple-400 font-semibold">— {quoteData.author}</p>
              <CopyQuoteButton quote={quoteData.content} author={quoteData.author} />
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  Inspirational quotes provided by{' '}
                  <a href="https://zenquotes.io/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-300">ZenQuotes API</a>
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">💡 Take a moment to reflect on this quote today</p>
            </div>
            {lastUpdatedMs && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">Last updated: {new Date(lastUpdatedMs).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    case 'fact': {
      const factData = data as { text: string; source?: string; source_url?: string };
      return (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="text-6xl mb-6">🧠</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Did You Know?</h2>
          </div>
          <div className="mb-6">
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <p className="text-lg text-gray-200 leading-relaxed">{factData.text}</p>
              <CopyFactButton text={factData.text} />
            </div>
          </div>
          {factData.source && (
            <div className="text-center text-sm text-gray-400">
              <p>
                Source: {factData.source}
                {factData.source_url && factData.source_url !== '#' && (
                  <a href={factData.source_url} target="_blank" rel="noopener noreferrer" className="underline text-emerald-400 hover:text-emerald-300 ml-1">(Learn more)</a>
                )}
              </p>
            </div>
          )}
          <div className="text-center pt-6 border-t border-gray-700 mt-8">
            <p className="text-sm text-gray-400">💡 Share this fact with a friend and impress them with your knowledge!</p>
          </div>
          {lastUpdatedMs && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">Last updated: {new Date(lastUpdatedMs).toLocaleString()}</p>
            </div>
          )}
        </div>
      );
    }
    case 'cocktail': {
      const cocktail = data as { name: string; category?: string; alcoholic?: string; glass?: string; instructions?: string; image?: string; ingredients: Array<{ ingredient: string; measure?: string }>; };
      return (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-5xl md:text-6xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 pb-1 mb-4">{cocktail.name}</h2>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {cocktail.category && <span className="inline-block bg-gray-900/40 text-gray-200 px-4 py-1.5 rounded-full font-medium border border-gray-700/60">{cocktail.category}</span>}
              {cocktail.alcoholic && <span className="inline-block bg-gray-900/40 text-gray-200 px-4 py-1.5 rounded-full font-medium border border-gray-700/60">{cocktail.alcoholic}</span>}
              {cocktail.glass && <span className="inline-block bg-gray-900/40 text-gray-200 px-4 py-1.5 rounded-full font-medium border border-gray-700/60">{cocktail.glass}</span>}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Ingredients</h3>
              <ul className="divide-y divide-gray-700 border border-gray-700 rounded-lg overflow-hidden">
                {cocktail.ingredients.map((item, index) => (
                  <li key={index} className="flex items-center justify-between gap-4 px-4 py-3 bg-gray-800">
                    <span className="text-gray-200">{item.ingredient}</span>
                    <span className="inline-flex items-center rounded-full bg-gray-900/50 text-gray-200 border border-gray-700 px-2.5 py-1 text-xs">{item.measure ?? 'To taste'}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Instructions</h3>
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <p className="text-lg text-gray-200 leading-relaxed whitespace-pre-line">{cocktail.instructions}</p>
              </div>
            </div>
          </div>
          {cocktail.image && (
            <div className="text-center mb-10">
              <div className="inline-block rounded-xl overflow-hidden border border-gray-700 shadow-xl">
                <Image src={cocktail.image} alt={cocktail.name} width={320} height={320} sizes="(max-width: 768px) 240px, 320px" className="w-60 h-60 md:w-80 md:h-80 object-cover" priority />
              </div>
            </div>
          )}
          <div className="text-center mt-10 space-y-4">
            <div className="text-sm text-gray-400">
              <p>
                Recipe data provided by{' '}
                <a href="https://www.thecocktaildb.com/" target="_blank" rel="noopener noreferrer" className="underline text-rose-300 hover:text-rose-200">TheCocktailDB</a>
              </p>
            </div>
            <div className="bg-rose-900/30 rounded-lg p-4 border border-rose-900/50">
              <p className="text-sm text-rose-200">🍹 Remember to drink responsibly and enjoy your cocktail!</p>
            </div>
            {lastUpdatedMs && (
              <div>
                <p className="text-xs text-gray-500">Last updated: {new Date(lastUpdatedMs).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    case 'word': {
      const wordData = data as { word: string; definition?: string; partOfSpeech?: string; example?: string };
      return (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-5xl md:text-6xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 pb-1 mb-4">{wordData.word}</h2>
            {wordData.partOfSpeech && <span className="inline-block bg-blue-900/40 text-blue-200 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-800/50">{wordData.partOfSpeech}</span>}
          </div>
          {wordData.definition && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Definition :</h3>
              <p className="text-lg text-gray-300 leading-relaxed">{wordData.definition}</p>
            </div>
          )}
          {wordData.example && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Example :</h3>
              <blockquote className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <p className="text-lg text-gray-200 italic">“{wordData.example}”</p>
                <CopyExampleButton text={wordData.example} />
              </blockquote>
            </div>
          )}
          <div className="text-center pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400">💡 Tip: Try using this word in a conversation today!</p>
          </div>
          {lastUpdatedMs && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">Last updated: {new Date(lastUpdatedMs).toLocaleString()}</p>
            </div>
          )}
        </div>
      );
    }
    case 'nasa': {
      const nasaData = data as { date: string; title: string; explanation: string; media_type: string; url: string; hdurl?: string; copyright?: string };
      return (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{nasaData.title}</h2>
            <p className="text-gray-400">{new Date(`${nasaData.date}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
          </div>
          <div className="mb-8">
            {nasaData.media_type === 'image' ? (
              <div className="relative w-full h-[55vh] md:h-[65vh] lg:h-[75vh] rounded-xl overflow-hidden bg-black">
                <Image src={nasaData.hdurl || nasaData.url} alt={nasaData.title} fill className="object-contain object-center" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw" priority />
              </div>
            ) : (
              <VideoEmbed url={nasaData.url} title={nasaData.title} />
            )}
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">About This Image</h3>
            <p className="text-gray-300 leading-relaxed text-lg">{nasaData.explanation}</p>
          </div>
          <div className="text-center text-sm text-gray-400 mb-6">
            {nasaData.copyright ? <p>Image Credit: {nasaData.copyright}</p> : <p>Image Credit: NASA</p>}
            {nasaData.hdurl && (
              <p className="mt-2"><a className="text-blue-400 hover:underline" href={nasaData.hdurl} target="_blank" rel="noreferrer">Open HD Version</a></p>
            )}
          </div>
          {lastUpdatedMs && (
            <div className="text-center mb-4">
              <p className="text-xs text-gray-500">Last updated: {new Date(lastUpdatedMs).toLocaleString()}</p>
            </div>
          )}
          <div className="text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-4">
              <p className="text-sm text-indigo-800 dark:text-indigo-200">🌌 Each day, NASA features a different image or photograph of our fascinating universe, along with a brief explanation written by a professional astronomer.</p>
            </div>
          </div>
        </div>
      );
    }
    case 'activity': {
      const activity = data as { activity: string; type: string; participants: number; price: number; accessibility: number; link?: string };
      function getAccessibilityText(accessibility: number) {
        if (accessibility <= 0.25) return 'Very Easy';
        if (accessibility <= 0.5) return 'Easy';
        if (accessibility <= 0.75) return 'Moderate';
        return 'Challenging';
      }
      function getPriceText(price: number) {
        if (price === 0) return 'Free';
        if (price <= 0.3) return 'Low Cost';
        if (price <= 0.6) return 'Moderate Cost';
        return 'Expensive';
      }
      const icons: Record<string, string> = { education: '📚', recreational: '🎮', social: '👥', diy: '🔧', charity: '❤️', cooking: '👨‍🍳', relaxation: '🧘', music: '🎵', busywork: '💼' };
      const getIcon = (type: string) => icons[type] || '🎯';
      return (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{getIcon(activity.type)}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{activity.activity}</h2>
            <span className="inline-block bg-orange-900/40 text-orange-200 border border-orange-800/50 px-4 py-2 rounded-full text-sm font-medium capitalize">{activity.type}</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold text-white mb-1">Participants</h3>
              <p className="text-gray-300">{activity.participants} {activity.participants === 1 ? 'person' : 'people'}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-white mb-1">Cost</h3>
              <p className="text-gray-300">{getPriceText(activity.price)}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-white mb-1">Difficulty</h3>
              <p className="text-gray-300">{getAccessibilityText(activity.accessibility)}</p>
            </div>
          </div>
          {activity.link && (
            <div className="text-center mb-6">
              <a
                href={activity.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-orange-800 text-white rounded-lg hover:bg-orange-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Learn More →
              </a>
            </div>
          )}
          <div className="text-center space-y-3">
            <div className="bg-orange-900/30 rounded-lg p-4">
              <p className="text-sm text-orange-200">🎯 Ready to try something new? This activity is perfect for today!</p>
            </div>
            <p className="text-xs text-gray-500">
              Activity data provided by{' '}
              <a href="https://bored.api.lewagon.com/" target="_blank" rel="noopener noreferrer" className="underline text-orange-600 dark:text-orange-200 hover:text-orange-700 dark:hover:text-orange-100">Le Wagon Bored API</a>
            </p>
          </div>
          {lastUpdatedMs && (
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">Last updated: {new Date(lastUpdatedMs).toLocaleString()}</p>
            </div>
          )}
        </div>
      );
    }
    case 'historical': {
      const historicalData = data as { year: string; text: string; links: Array<{ title: string; link: string }> };
      return (
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">On This Day in History</h2>
          </div>
          <div className="mb-8">
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="text-center mb-4">
                <span className="inline-block bg-gray-900/40 text-red-200 border border-red-800/50 px-4 py-2 rounded-full text-lg font-bold">{historicalData.year}</span>
              </div>
              <p className="text-lg text-gray-200 leading-relaxed">{historicalData.text}</p>
            </div>
          </div>
          {historicalData.links && historicalData.links.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Learn More:</h3>
              <div className="space-y-2">
                {historicalData.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block underline text-red-400 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="text-center">
            <div className="bg-red-900/30 rounded-lg p-4 border border-red-900/50">
              <p className="text-sm text-red-200">📚 History is full of fascinating moments. Take time to reflect on how far we&apos;ve come!</p>
            </div>
          </div>
          {lastUpdatedMs && (
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">Last updated: {new Date(lastUpdatedMs).toLocaleString()}</p>
            </div>
          )}
        </div>
      );
    }
    default:
      return null;
  }
}



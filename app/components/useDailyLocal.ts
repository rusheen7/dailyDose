'use client';

import { useEffect, useMemo, useRef } from 'react';
import { getLocalDateKey, msUntilNextLocalMidnight } from '@/lib/clientTime';

// In-memory fallback store for environments without window.localStorage (SSR/tests)
const memoryStore = new Map<string, string>();

export type DailyCacheRecord<T> = {
  dateKey: string;
  payload: T;
  storedAtMs: number;
};

function makeStorageKey(namespace: string, dateKey: string): string {
  return `daily:${namespace}:${dateKey}`;
}

export function getCached<T>(namespace: string, dateKey: string): T | null {
  try {
    const key = makeStorageKey(namespace, dateKey);
    const raw = typeof window === 'undefined'
      ? memoryStore.get(key) ?? null
      : window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyCacheRecord<T>;
    if (!parsed || parsed.dateKey !== dateKey) return null;
    return parsed.payload as T;
  } catch {
    return null;
  }
}

export function getCachedRecord<T>(namespace: string, dateKey: string): DailyCacheRecord<T> | null {
  try {
    const key = makeStorageKey(namespace, dateKey);
    const raw = typeof window === 'undefined'
      ? memoryStore.get(key) ?? null
      : window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyCacheRecord<T>;
    if (!parsed || parsed.dateKey !== dateKey) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setCached<T>(namespace: string, dateKey: string, payload: T): void {
  try {
    const record: DailyCacheRecord<T> = {
      dateKey,
      payload,
      storedAtMs: Date.now(),
    };
    const key = makeStorageKey(namespace, dateKey);
    const value = JSON.stringify(record);
    if (typeof window === 'undefined') {
      memoryStore.set(key, value);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Ignore quota or serialization issues
  }
}

export function useDailyLocal(options?: { onMidnight?: () => void }) {
  const dateKey = useMemo(() => getLocalDateKey(), []);
  const onMidnightRef = useRef(options?.onMidnight);
  onMidnightRef.current = options?.onMidnight;

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      const delay = msUntilNextLocalMidnight();
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        try {
          onMidnightRef.current?.();
        } finally {
          // Reschedule for the next midnight
          schedule();
        }
      }, Math.max(1, delay));
    };

    schedule();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const ms = useMemo(() => msUntilNextLocalMidnight(), []);

  return { dateKey, msUntilNextMidnight: ms } as const;
}

export default useDailyLocal;



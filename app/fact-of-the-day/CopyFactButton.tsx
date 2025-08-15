'use client';

import { useState } from 'react';

type CopyFactButtonProps = {
  text: string;
};

export default function CopyFactButton({ text }: CopyFactButtonProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }

  const canShare = typeof navigator !== 'undefined' && !!(navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share;

  async function onShare() {
    try {
      if (!canShare) return;
      await (navigator as unknown as Navigator & { share?: (data: ShareData) => Promise<void> }).share?.({ text });
    } catch {
      // user cancelled or share unsupported
    }
  }

  return (
    <div className="mt-4 flex items-center justify-start gap-3" aria-live="polite">
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500 text-gray-100 border border-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      {canShare && (
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-600 hover:bg-gray-500 text-gray-100 border border-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Share
        </button>
      )}
    </div>
  );
}



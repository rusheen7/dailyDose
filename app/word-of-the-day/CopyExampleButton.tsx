'use client';

import { useState } from 'react';

type CopyExampleButtonProps = {
  text?: string;
};

export default function CopyExampleButton({ text }: CopyExampleButtonProps) {
  const [copied, setCopied] = useState(false);

  if (!text) return null;

  async function onCopy() {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }

  return (
    <div className="mt-3 flex items-center justify-end">
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-live="polite"
      >
        {copied ? 'Copied!' : 'Copy Example'}
      </button>
    </div>
  );
}



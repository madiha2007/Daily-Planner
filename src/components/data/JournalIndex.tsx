'use client';

import { format, parseISO } from 'date-fns';
import { JournalEntry } from '@/lib/types';
import AnimatedMoodEmoji from '@/components/ui/AnimatedMoodEmoji';

export default function JournalIndex({ entries }: { entries: JournalEntry[] }) {
  if (entries.length === 0) return null;

  const scrollToEntry = (id: string) => {
    document.getElementById(`entry-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <nav className="sticky top-24 hidden h-fit min-h-[80vh] flex-col gap-0.5 overflow-y-auto rounded-lg border border-peach-100 bg-gradient-to-br from-peach-100 to-blush-100 p-3 md:flex">
      <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-peach-600/80">
        Entries
      </p>
      {entries.map((entry) => (
        <button
          key={entry.id}
          onClick={() => scrollToEntry(entry.id)}
          className="flex items-start gap-2 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-peach-50"
        >
          <span className="mt-0.5 shrink-0">
            <AnimatedMoodEmoji mood={entry.mood} size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium text-cocoa-700">
              {entry.title || entry.content.slice(0, 28) || 'Untitled'}
            </span>
            <span className="block text-[10px] text-cocoa-300">
              {format(parseISO(entry.createdAt), 'MMM d')}
            </span>
          </span>
        </button>
      ))}
    </nav>
  );
}
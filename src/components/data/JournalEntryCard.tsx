'use client';

import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { JournalEntry } from '@/lib/types';
import { useJournalStore } from '@/stores/useJournalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { JOURNAL_COLORS } from '@/lib/theme/journalPalette';

const moodEmoji: Record<JournalEntry['mood'], string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  low: '😔',
  rough: '😣',
};

export default function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const removeEntry = useJournalStore((s) => s.removeEntry);
  const open = useOverlayStore((s) => s.open);

  const swatch = JOURNAL_COLORS.find((c) => c.id === entry.color) ?? JOURNAL_COLORS[0];

  return (
    <div
      className="group relative flex cursor-pointer gap-3 rounded-xl p-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
      style={{ backgroundColor: swatch.soft }}
      onClick={() => open('addJournal', { entry })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open('addJournal', { entry });
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Left: image (or mood-colored placeholder) with mood badge */}
      <div className="relative h-20 w-20 shrink-0">
        {entry.image ? (
          <img
            src={entry.image}
            alt=""
            className="h-full w-full rounded-lg object-cover shadow-warm"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center rounded-lg text-2xl shadow-warm"
            style={{ backgroundColor: swatch.hex }}
          >
            {moodEmoji[entry.mood]}
          </div>
        )}
        {entry.image && (
          <span
            className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs shadow-warm"
            style={{ backgroundColor: swatch.hex }}
          >
            {moodEmoji[entry.mood]}
          </span>
        )}
      </div>

      {/* Right: content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          {entry.title ? (
            <h4 className="truncate text-sm font-semibold text-cocoa-800">{entry.title}</h4>
          ) : (
            <span />
          )}
          <span className="shrink-0 text-[11px] text-cocoa-400">
            {format(parseISO(entry.createdAt), 'MMM d · h:mma')}
          </span>
        </div>

        <p className="mt-1 text-sm text-cocoa-700 line-clamp-2">{entry.content}</p>

        {entry.stickers?.length > 0 && (
          <div className="mt-2 flex gap-1 text-sm">
            {entry.stickers?.slice(0, 6).map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          removeEntry(entry.id);
        }}
        aria-label="Delete journal entry"
        className="absolute bottom-2 right-2 rounded-lg p-1.5 text-cocoa-400 opacity-0 transition-opacity hover:bg-white/60 hover:text-red-400 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
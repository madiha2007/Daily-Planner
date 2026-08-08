'use client';

import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
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
      className="group relative flex cursor-pointer flex-col rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
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
      <div className="flex items-start justify-between">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base shadow-warm"
          style={{ backgroundColor: swatch.hex }}
        >
          {moodEmoji[entry.mood]}
        </span>
        <span className="text-[11px] text-cocoa-400">
          {format(parseISO(entry.createdAt), 'MMM d · h:mma')}
        </span>
      </div>

      {entry.title && (
        <h4 className="mt-2 text-sm font-semibold text-cocoa-800 line-clamp-1">{entry.title}</h4>
      )}
      <p className="mt-1 text-sm text-cocoa-700 line-clamp-3">{entry.content}</p>

      {entry.stickers?.length > 0 && (
        <div className="mt-2 flex gap-1 text-sm">
          {entry.stickers?.slice(0, 6).map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          removeEntry(entry.id);
        }}
        aria-label="Delete journal entry"
        className="absolute bottom-3 right-3 rounded-lg p-1.5 text-cocoa-400 opacity-0 transition-opacity hover:bg-white/60 hover:text-red-400 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
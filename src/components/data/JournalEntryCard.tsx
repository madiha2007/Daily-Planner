'use client';

import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import { JournalEntry } from '@/lib/types';
import { useJournalStore } from '@/stores/useJournalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { JOURNAL_COLORS } from '@/lib/theme/journalPalette';
import { useState } from 'react';

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
  const dateLabel = format(parseISO(entry.createdAt), 'MMM d · h:mma');
  const stickers = entry.stickers ?? [];
  const imagePosition = entry.imagePosition ?? 'top';
  const [imgFailed, setImgFailed] = useState(false);

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeEntry(entry.id);
  };

  if (imagePosition === 'left') {
  return (
    <Card
      className="group relative flex cursor-pointer flex-col overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-card sm:flex-row"
      onClick={() => open('viewJournal', { entry })}
    >
      <div
        className="relative h-40 w-full shrink-0 sm:h-auto sm:w-32 sm:min-w-[8rem]"
        style={!entry.image ? { backgroundColor: swatch.hex } : undefined}
      >
        {entry.image && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.image}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">{moodEmoji[entry.mood]}</div>
        )}
      </div>

      <div className="flex min-h-[30vh] min-w-0 flex-1 flex-col p-4" style={{ backgroundColor: swatch.soft }}>
        <div className="flex items-start justify-between gap-2">
          {entry.title && (
            <h4 className="min-w-0 flex-1 text-sm font-semibold text-cocoa-800 line-clamp-1">
              {entry.title}
            </h4>
          )}
          <span className="shrink-0 text-[11px] text-cocoa-400">{dateLabel}</span>
        </div>
        <p className="mt-1 flex-1 text-sm text-cocoa-700 line-clamp-3">{entry.content}</p>
        {stickers.length > 0 && (
          <div className="mt-2 flex gap-1 text-sm">
            {stickers.slice(0, 6).map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onDelete}
        aria-label="Delete journal entry"
        className="absolute bottom-2 right-2 rounded-lg bg-white/70 p-1.5 text-cocoa-400 opacity-0 transition-opacity hover:bg-white hover:text-red-400 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </Card>
  );
}

  return (
    <Card
      className="group relative flex min-h-[30vh] cursor-pointer flex-col overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-card"
      onClick={() => open('viewJournal', { entry })}
    >
      <div className="relative h-36 w-full shrink-0" style={!entry.image ? { backgroundColor: swatch.hex } : undefined}>
        {entry.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={entry.image} alt="" className="h-full w-full object-cover" />
        )}
        {!entry.image && (
          <div className="flex h-full items-center justify-center text-4xl">{moodEmoji[entry.mood]}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm shadow">
          {moodEmoji[entry.mood]}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] text-cocoa-600 shadow">
          {dateLabel}
        </span>
        {entry.title && (
          <h4 className="absolute bottom-2.5 left-3 right-3 text-sm font-semibold text-white line-clamp-1">
            {entry.title}
          </h4>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4" style={{ backgroundColor: swatch.soft }}>
        <p className="text-sm text-cocoa-700 line-clamp-3">{entry.content}</p>
        {stickers.length > 0 && (
          <div className="mt-2 flex gap-1 text-sm">
            {stickers.slice(0, 6).map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onDelete}
        aria-label="Delete journal entry"
        className="absolute bottom-2 right-2 rounded-lg bg-white/70 p-1.5 text-cocoa-400 opacity-0 transition-opacity hover:bg-white hover:text-red-400 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </Card>
  );
}
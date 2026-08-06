'use client';

import { format, parseISO } from 'date-fns';
import { Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { JournalEntry } from '@/lib/types';
import { useJournalStore } from '@/stores/useJournalStore';

const moodEmoji: Record<JournalEntry['mood'], string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  low: '😔',
  rough: '😣',
};

const moodTone: Record<JournalEntry['mood'], 'peach' | 'cream' | 'neutral' | 'blush' | 'red'> = {
  great: 'peach',
  good: 'cream',
  okay: 'neutral',
  low: 'blush',
  rough: 'red',
};

export default function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const removeEntry = useJournalStore((s) => s.removeEntry);

  return (
    <Card className="group relative">
      <div className="flex items-start justify-between mb-2">
        <Badge tone={moodTone[entry.mood]}>
          {moodEmoji[entry.mood]} {entry.mood}
        </Badge>
        <span className="text-xs text-cocoa-400">{format(parseISO(entry.createdAt), 'MMM d')}</span>
      </div>
      <p className="text-sm text-cocoa-700 line-clamp-3">{entry.content}</p>
      <button
        onClick={() => removeEntry(entry.id)}
        aria-label="Delete journal entry"
        className="absolute right-3 bottom-3 rounded-lg p-1.5 text-cocoa-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-400 transition-opacity"
      >
        <Trash2 size={14} />
      </button>
    </Card>
  );
}
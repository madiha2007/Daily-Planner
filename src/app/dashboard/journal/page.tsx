'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { Plus, ArrowLeft, BookHeart } from 'lucide-react';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Card from '@/components/ui/Card';
import JournalEntryCard from '@/components/data/JournalEntryCard';
import OverlayRoot from '@/components/overlays/OverlayRoot';
import { useJournalStore } from '@/stores/useJournalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { formatDateISO } from '@/lib/utils';
import { JournalEntry } from '@/lib/types';
import Sidebar from '@/components/layout/Sidebar';

const MOODS: { id: JournalEntry['mood']; emoji: string }[] = [
  { id: 'great', emoji: '😄' },
  { id: 'good', emoji: '🙂' },
  { id: 'okay', emoji: '😐' },
  { id: 'low', emoji: '😔' },
  { id: 'rough', emoji: '😣' },
];

export default function JournalPage() {
  const { entries, loading, fetchAll } = useJournalStore();
  const open = useOverlayStore((s) => s.open);
  const [moodFilter, setMoodFilter] = useState<JournalEntry['mood'] | null>(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const grouped = useMemo(() => {
    const filtered = moodFilter ? entries.filter((e) => e.mood === moodFilter) : entries;
    const map = new Map<string, JournalEntry[]>();
    filtered.forEach((e) => {
      const key = formatDateISO(new Date(e.createdAt));
      map.set(key, [...(map.get(key) ?? []), e]);
    });
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [entries, moodFilter]);

  return (
    <div className="min-h-screen bg-cream-50">
        <Sidebar  />
      <div className="px-6 py-8 sm:px-10 md:pl-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-1 inline-flex items-center gap-1 text-xs text-cocoa-400 hover:text-peach-600"
            >
              <ArrowLeft size={13} /> Back to dashboard
            </Link>
            <h1 className="text-2xl font-semibold text-cocoa-800">Journal</h1>
          </div>
          <Button onClick={() => open('addJournal')}>
            <Plus size={16} /> New Entry
          </Button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setMoodFilter(null)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              moodFilter === null
                ? 'border-peach-400 bg-peach-400 text-white'
                : 'border-peach-200 bg-white text-cocoa-500 hover:bg-peach-50'
            }`}
          >
            All
          </button>
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMoodFilter(m.id)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                moodFilter === m.id
                  ? 'border-peach-400 bg-peach-400 text-white'
                  : 'border-peach-200 bg-white text-cocoa-500 hover:bg-peach-50'
              }`}
            >
              {m.emoji}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <Card>
            <EmptyState
              icon={BookHeart}
              title="No journal entries yet"
              message="Start writing about your day."
              action={
                <Button size="sm" onClick={() => open('addJournal')}>
                  <Plus size={15} /> New Entry
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-8">
            {grouped.map(([date, dayEntries]) => (
              <div key={date}>
                <p className="mb-3 text-sm font-semibold text-cocoa-600">
                  {format(parseISO(date), 'EEEE, MMMM d')}
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {dayEntries.map((entry) => (
                    <JournalEntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      <OverlayRoot />
    </div>
  );
}
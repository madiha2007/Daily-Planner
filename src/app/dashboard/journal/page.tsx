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
import JournalIndex from '@/components/data/JournalIndex';
import OverlayRoot from '@/components/overlays/OverlayRoot';
import AnimatedMoodEmoji from '@/components/ui/AnimatedMoodEmoji';
import { useJournalStore } from '@/stores/useJournalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { formatDateISO } from '@/lib/utils';
import { JournalEntry } from '@/lib/types';
import Sidebar from '@/components/layout/Sidebar';

const MOODS: { id: JournalEntry['mood']; label: string }[] = [
  { id: 'great', label: 'Great' },
  { id: 'good', label: 'Good' },
  { id: 'okay', label: 'Okay' },
  { id: 'low', label: 'Low' },
  { id: 'rough', label: 'Rough' },
];

export default function JournalPage() {
  const { entries, loading, fetchAll } = useJournalStore();
  const open = useOverlayStore((s) => s.open);
  const [moodFilter, setMoodFilter] = useState<JournalEntry['mood'] | null>(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(
    () => (moodFilter ? entries.filter((e) => e.mood === moodFilter) : entries),
    [entries, moodFilter]
  );

  const indexEntries = useMemo(
    () => [...filtered].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [filtered]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, JournalEntry[]>();
    filtered.forEach((e) => {
      const key = formatDateISO(new Date(e.createdAt));
      map.set(key, [...(map.get(key) ?? []), e]);
    });
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filtered]);

  return (
    <div className="min-h-screen bg-cream-50">
  <Sidebar />
  <div className="px-4 pb-6 pt-16 sm:px-6 sm:pb-8 md:pl-[6.5rem] md:pr-10 md:pt-8">
    <div className="w-full">
          <div className="mb-6 flex flex-col gap-3 lg:mt-0 mt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-1 inline-flex items-center gap-1 text-xs text-cocoa-400 hover:text-peach-600"
              >
                <ArrowLeft size={13} /> Back to dashboard
              </Link>
              <h1 className="text-2xl font-semibold text-cocoa-800">Journal</h1>
            </div>
            <Button onClick={() => open('addJournal')} className="w-full sm:w-auto">
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
                className={`flex items-center gap-1.5 rounded-full border py-1 pl-1.5 pr-3 text-xs transition-colors ${
                  moodFilter === m.id
                    ? 'border-peach-400 bg-peach-400 text-white'
                    : 'border-peach-200 bg-white text-cocoa-500 hover:bg-peach-50'
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/60">
                  <AnimatedMoodEmoji mood={m.id} size={16} />
                </span>
                {m.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[3fr_7fr]">
            <JournalIndex entries={indexEntries} />

            <div className="min-w-0">
              {loading ? (
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 min-w-[260px] flex-1" />
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
                      <div className="flex flex-wrap gap-4">
                        {dayEntries.map((entry) => (
                          <div key={entry.id} id={`entry-${entry.id}`} className="min-w-[260px] flex-1 scroll-mt-24">
                            <JournalEntryCard entry={entry} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <OverlayRoot />
    </div>
  );
}
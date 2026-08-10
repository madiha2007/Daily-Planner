'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, BookHeart, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import JournalEntryCard from '@/components/data/JournalEntryCard';
import { useJournalStore } from '@/stores/useJournalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { formatDateISO } from '@/lib/utils';

const PREVIEW_LIMIT = 5;

export default function JournalSection() {
  const { entries, loading, fetchAll } = useJournalStore();
  const open = useOverlayStore((s) => s.open);
  const router = useRouter();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const today = formatDateISO(new Date());
  const todayEntries = useMemo(
    () => entries.filter((e) => formatDateISO(new Date(e.createdAt)) === today),
    [entries, today]
  );
  const preview = todayEntries.slice(0, PREVIEW_LIMIT);

  return (
    <section id="journal" className="scroll-mt-20 rounded-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-cocoa-800">Today&apos;s Journal</h2>

        {entries.length > 0 && (
          <Button size="sm" onClick={() => router.push('/dashboard/journal')}>
            Go to Journal page <ArrowRight size={15} />
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : preview.length === 0 ? (
        <Card>
          <EmptyState
            icon={BookHeart}
            title="No entries today"
            message="Write down how today went."
            action={
              <Button size="sm" onClick={() => open('addJournal')}>
                <Plus size={15} /> New Entry
              </Button>
            }
          />
        </Card>
      ) : (
        <div>
          {preview.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
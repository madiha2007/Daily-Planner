'use client';

import { useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import JournalEntryCard from '@/components/data/JournalEntryCard';
import { useJournalStore } from '@/stores/useJournalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';

export default function JournalSection() {
  const { entries, loading, fetchAll } = useJournalStore();
  const open = useOverlayStore((s) => s.open);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <section id="journal" className="scroll-mt-20 rounded-2xl pb-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Journal</h2>
        <Button size="sm" onClick={() => open('addJournal')}>
          <Plus size={15} /> New Entry
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : entries.length === 0 ? (
        <Card>
          <EmptyState
            icon={BookOpen}
            title="No entries yet"
            message="Write your first journal entry to reflect on your day."
            action={
              <Button size="sm" onClick={() => open('addJournal')}>
                <Plus size={15} /> New Entry
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}

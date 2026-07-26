'use client';

import { useEffect } from 'react';
import { Plus, Repeat } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import HabitItem from '@/components/data/HabitItem';
import { useHabitStore } from '@/stores/useHabitStore';
import { useOverlayStore } from '@/stores/useOverlayStore';

export default function HabitsSection() {
  const { habits, loading, fetchAll } = useHabitStore();
  const open = useOverlayStore((s) => s.open);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <section id="habits" className="scroll-mt-20 rounded-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Habits</h2>
        <Button size="sm" onClick={() => open('addHabit')}>
          <Plus size={15} /> Add Habit
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : habits.length === 0 ? (
        <Card>
          <EmptyState
            icon={Repeat}
            title="No habits yet"
            message="Start tracking a habit to build momentum."
            action={
              <Button size="sm" onClick={() => open('addHabit')}>
                <Plus size={15} /> Add Habit
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="p-2">
          {habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} />
          ))}
        </Card>
      )}
    </section>
  );
}

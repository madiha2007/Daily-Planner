'use client';

import { useEffect } from 'react';
import { Plus, Repeat, Target } from 'lucide-react';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
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
    <section id="habits" className="scroll-mt-20 rounded-2xl h-full">
      <div className="flex h-full flex-col rounded-3xl border border-peach-300 bg-gradient-to-br from-peach-100 to-blush-100 p-4 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-peach-600" />
            <h2 className="text-sm font-semibold text-cocoa-800">Habit Tracker</h2>
          </div>
          <button
            onClick={() => open('addHabit')}
            aria-label="Add habit"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-peach-400 to-blush-400 text-white shadow-warm hover:brightness-105"
          >
            <Plus size={15} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : habits.length === 0 ? (
          <EmptyState
            icon={Repeat}
            title="No habits yet"
            message="Start tracking a habit."
            action={
              <Button size="sm" onClick={() => open('addHabit')}>
                <Plus size={15} /> Add Habit
              </Button>
            }
          />
        ) : (
          <div className="flex flex-1 flex-col gap-0.5">
            {habits.map((habit) => (
              <HabitItem key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
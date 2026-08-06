'use client';

import { useEffect } from 'react';
import { Plus, Target } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import GoalCard from '@/components/data/GoalCard';
import { useGoalStore } from '@/stores/useGoalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';

export default function GoalsSection() {
  const { goals, loading, fetchAll } = useGoalStore();
  const open = useOverlayStore((s) => s.open);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <section id="goals" className="scroll-mt-20 rounded-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-cocoa-800">Goals</h2>
        <Button size="sm" onClick={() => open('addGoal')}>
          <Plus size={15} /> Add Goal
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : goals.length === 0 ? (
        <Card>
          <EmptyState
            icon={Target}
            title="No goals yet"
            message="Set a goal to track your bigger milestones."
            action={
              <Button size="sm" onClick={() => open('addGoal')}>
                <Plus size={15} /> Add Goal
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </section>
  );
}
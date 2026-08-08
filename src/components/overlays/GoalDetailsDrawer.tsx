'use client';

import { format, parseISO } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ProgressRing from '@/components/ui/ProgressRing';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { useGoalStore } from '@/stores/useGoalStore';
import { Goal } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function GoalDetailsDrawer() {
  const payload = useOverlayStore((s) => s.payload) as { goal: Goal } | null;
  const goals = useGoalStore((s) => s.goals);
  const editGoal = useGoalStore((s) => s.editGoal);

  const goal = goals.find((g) => g.id === payload?.goal.id) ?? payload?.goal;

  if (!goal) return null;

  const toggleMilestone = (milestoneId: string) => {
    const milestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, done: !m.done } : m
    );
    const progress = milestones.length
      ? Math.round((milestones.filter((m) => m.done).length / milestones.length) * 100)
      : 0;
    editGoal(goal.id, { milestones, progress });
  };

  return (
    <Modal title={goal.title} maxWidth="max-w-md">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <ProgressRing progress={goal.progress} size={64} />
          <div>
            <p className="text-sm text-cocoa-400">Target date</p>
            <p className="text-sm font-medium text-cocoa-800">
              {format(parseISO(goal.targetDate), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {goal.description && <p className="text-sm text-cocoa-600">{goal.description}</p>}

        <div>
          <p className="mb-2 text-sm font-medium text-cocoa-700">Milestones</p>
          {goal.milestones.length === 0 ? (
            <p className="text-sm text-cocoa-400">No milestones added for this goal yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {goal.milestones.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleMilestone(m.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
                    m.done
                      ? 'border-peach-300 bg-peach-50 text-peach-700'
                      : 'border-peach-100 bg-white hover:bg-peach-50'
                  )}
                >
                  {m.done ? (
                    <CheckCircle2 size={18} className="text-peach-500" />
                  ) : (
                    <Circle size={18} className="text-cocoa-200" />
                  )}
                  <span className={cn(m.done && 'line-through')}>{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
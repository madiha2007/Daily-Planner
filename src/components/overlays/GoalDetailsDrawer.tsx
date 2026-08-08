'use client';

import { format, parseISO } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';
import ProgressRing from '@/components/ui/ProgressRing';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { useGoalStore } from '@/stores/useGoalStore';
import { Goal } from '@/lib/types';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/Modal';

export default function GoalDetailsDrawer() {
  const payload = useOverlayStore((s) => s.payload) as { goal: Goal } | null;
  const editGoal = useGoalStore((s) => s.editGoal);
  const goal = payload?.goal;

  if (!goal) return null;

  const toggleMilestone = (milestoneId: string) => {
    const milestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, done: !m.done } : m
    );
    const progress = Math.round((milestones.filter((m) => m.done).length / milestones.length) * 100);
    editGoal(goal.id, { milestones, progress });
  };

  return (
    <Modal title={goal.title}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <ProgressRing progress={goal.progress} size={64} />
          <div>
            <p className="text-sm text-neutral-500">Target date</p>
            <p className="text-sm font-medium text-neutral-800">
              {format(parseISO(goal.targetDate), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {goal.description && <p className="text-sm text-neutral-600">{goal.description}</p>}

        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">Milestones</p>
          <div className="flex flex-col gap-2">
            {goal.milestones.map((m) => (
              <button
                key={m.id}
                onClick={() => toggleMilestone(m.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
                  m.done ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-neutral-200 hover:bg-neutral-50'
                )}
              >
                {m.done ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-neutral-300" />}
                <span className={cn(m.done && 'line-through')}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

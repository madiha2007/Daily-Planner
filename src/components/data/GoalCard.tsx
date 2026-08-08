'use client';

import { format, parseISO } from 'date-fns';
import { Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import { useGoalStore } from '@/stores/useGoalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { Goal } from '@/lib/types';
import { cn } from '@/lib/utils';

const AVATAR_GRADIENTS = [
  'from-peach-300 to-blush-300',
  'from-blush-300 to-peach-400',
  'from-peach-400 to-cocoa-300',
  'from-cream-300 to-peach-300',
];

function avatarGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

export default function GoalCard({ goal }: { goal: Goal }) {
  const editGoal = useGoalStore((s) => s.editGoal);
  const open = useOverlayStore((s) => s.open);

  const total = goal.milestones.length;
  const doneCount = goal.milestones.filter((m) => m.done).length;
  const preview = goal.milestones.slice(0, 3);
  const remaining = total - preview.length;

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
    <Card className="flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-semibold text-white shadow-warm',
            avatarGradient(goal.id)
          )}
        >
          {goal.title.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold leading-snug text-cocoa-800 line-clamp-2">
            {goal.title}
          </h3>
          <p className="mt-1 text-xs text-cocoa-400">
            {doneCount}/{total} milestones completed
            {goal.targetDate && <> · due {format(parseISO(goal.targetDate), 'MMM')}</>}
          </p>
        </div>
      </div>

      {total > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-peach-600/80">
            Milestones
          </p>
          <div className="flex flex-col gap-2">
            {preview.map((m) => (
              <button
                key={m.id}
                onClick={() => toggleMilestone(m.id)}
                className="group flex items-center gap-2.5 text-left"
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    m.done
                      ? 'border-peach-400 bg-peach-400'
                      : 'border-peach-200 bg-white group-hover:border-peach-300'
                  )}
                >
                  {m.done && <Check size={12} className="text-white" strokeWidth={3} />}
                </span>
                <span className={cn('text-sm text-cocoa-700', m.done && 'text-cocoa-300 line-through')}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="mr-3 h-1.5 flex-1 overflow-hidden rounded-full bg-peach-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-peach-400 to-blush-400 transition-all"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        <button
          onClick={() => open('goalDetails', { goal })}
          className="shrink-0 text-xs italic text-cocoa-400 underline decoration-peach-300 underline-offset-2 hover:text-peach-600"
        >
          {remaining > 0 ? `+${remaining} more..` : 'more..'}
        </button>
      </div>
    </Card>
  );
}
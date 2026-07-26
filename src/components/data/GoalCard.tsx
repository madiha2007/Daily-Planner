'use client';

import { format, parseISO } from 'date-fns';
import Card from '@/components/ui/Card';
import ProgressRing from '@/components/ui/ProgressRing';
import { Goal } from '@/lib/types';
import { useOverlayStore } from '@/stores/useOverlayStore';

export default function GoalCard({ goal }: { goal: Goal }) {
  const open = useOverlayStore((s) => s.open);
  const doneMilestones = goal.milestones.filter((m) => m.done).length;

  return (
    <Card as="button" onClick={() => open('goalDetails', { goal })} className="flex items-center gap-4">
      <ProgressRing progress={goal.progress} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-neutral-800 truncate">{goal.title}</p>
        <p className="text-xs text-neutral-400">
          {doneMilestones}/{goal.milestones.length} milestones &middot; due{' '}
          {format(parseISO(goal.targetDate), 'MMM d')}
        </p>
      </div>
    </Card>
  );
}

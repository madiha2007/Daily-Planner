'use client';

import { Pencil } from 'lucide-react';
import { Habit } from '@/lib/types';
import { cn, formatDateISO } from '@/lib/utils';
import { useHabitStore } from '@/stores/useHabitStore';
import { useOverlayStore } from '@/stores/useOverlayStore';

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
};

export default function HabitItem({ habit }: { habit: Habit }) {
  const toggleToday = useHabitStore((s) => s.toggleToday);
  const open = useOverlayStore((s) => s.open);

  const today = formatDateISO(new Date());
  const doneToday = habit.completions.includes(today);
  const weekCount = habit.completions.filter((d) => {
    const diff = (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-transparent p-3 hover:border-neutral-200 hover:bg-neutral-50 transition-all">
      <button
        onClick={() => toggleToday(habit.id)}
        aria-label={doneToday ? 'Mark habit not done today' : 'Mark habit done today'}
        className={cn(
          'h-9 w-9 shrink-0 rounded-full flex items-center justify-center transition-colors',
          doneToday ? colorMap[habit.color] : 'bg-neutral-100'
        )}
      >
        <span className={cn('h-2.5 w-2.5 rounded-full', doneToday ? 'bg-white' : 'bg-neutral-300')} />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-800 truncate">{habit.title}</p>
        <p className="text-xs text-neutral-400">
          {weekCount}/{habit.targetPerWeek} this week
        </p>
      </div>

      <button
        onClick={() => open('editHabit', { habit })}
        aria-label="Edit habit"
        className="rounded-lg p-1.5 text-neutral-400 opacity-0 group-hover:opacity-100 hover:bg-neutral-100 hover:text-neutral-600 transition-opacity"
      >
        <Pencil size={14} />
      </button>
    </div>
  );
}

'use client';

import { Pencil } from 'lucide-react';
import { Habit } from '@/lib/types';
import { cn, formatDateISO } from '@/lib/utils';
import { useHabitStore } from '@/stores/useHabitStore';
import { useOverlayStore } from '@/stores/useOverlayStore';

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
    <div className="group flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/50 transition-colors">
      <button
        onClick={() => toggleToday(habit.id)}
        aria-label={doneToday ? 'Mark habit not done today' : 'Mark habit done today'}
        className={cn(
          'h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors',
          doneToday ? 'border-blue-600 bg-blue-600' : 'border-blue-300 bg-white'
        )}
      >
        {doneToday && <div className="h-2 w-2 rounded-sm bg-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-800 truncate">{habit.title}</p>
        <p className="text-xs text-blue-700/60">
          {weekCount}/{habit.targetPerWeek} this week
        </p>
      </div>

      <button
        onClick={() => open('editHabit', { habit })}
        aria-label="Edit habit"
        className="rounded-lg p-1.5 text-blue-400 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-blue-600 transition-opacity"
      >
        <Pencil size={14} />
      </button>
    </div>
  );
}

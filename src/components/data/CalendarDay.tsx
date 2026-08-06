'use client';

import { isSameMonth, isToday, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useOverlayStore } from '@/stores/useOverlayStore';

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  taskCount: number;
}

export default function CalendarDay({ date, currentMonth, taskCount }: CalendarDayProps) {
  const open = useOverlayStore((s) => s.open);
  const inMonth = isSameMonth(date, currentMonth);
  const today = isToday(date);
  const iso = format(date, 'yyyy-MM-dd');

  return (
    <button
      onClick={() => open('dayDetails', { date: iso })}
      className={cn(
        'aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm transition-colors',
        inMonth ? 'text-cocoa-700 hover:bg-peach-100' : 'text-cocoa-200 hover:bg-peach-50',
        today && 'bg-gradient-to-br from-peach-400 to-blush-400 text-white hover:brightness-105'
      )}
    >
      <span>{format(date, 'd')}</span>
      {taskCount > 0 && (
        <span className={cn('h-1 w-1 rounded-full', today ? 'bg-white' : 'bg-peach-400')} />
      )}
    </button>
  );
}
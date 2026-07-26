'use client';

import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { DayActivity } from '@/lib/types';

const intensityClasses: Record<DayActivity['intensity'], string> = {
  0: 'bg-neutral-100',
  1: 'bg-emerald-100',
  2: 'bg-emerald-300',
  3: 'bg-emerald-500',
  4: 'bg-emerald-700',
};

export default function HeatmapCell({ day }: { day: DayActivity }) {
  const open = useOverlayStore((s) => s.open);
  const label = `${format(parseISO(day.date), 'MMM d, yyyy')}, activity level ${day.intensity} of 4`;

  return (
    <button
      onClick={() => open('dayDetails', { date: day.date })}
      aria-label={label}
      title={label}
      className={cn(
        'h-3.5 w-3.5 rounded-[3px] transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
        intensityClasses[day.intensity]
      )}
    />
  );
}

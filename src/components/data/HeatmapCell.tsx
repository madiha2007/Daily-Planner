'use client';

import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { DayActivity } from '@/lib/types';

const intensityClasses: Record<DayActivity['intensity'], string> = {
  0: 'bg-peach-50',
  1: 'bg-peach-200',
  2: 'bg-peach-300',
  3: 'bg-peach-400',
  4: 'bg-peach-600',
};

export default function HeatmapCell({
  day,
  sizeClassName = 'h-3.5 w-3.5',
}: {
  day: DayActivity;
  sizeClassName?: string;
}) {
  const open = useOverlayStore((s) => s.open);
  const label = `${format(parseISO(day.date), 'MMM d, yyyy')}, activity level ${day.intensity} of 4`;

  return (
    <button
      onClick={() => open('dayDetails', { date: day.date })}
      aria-label={label}
      title={label}
      className={cn(
        'shrink-0 rounded-[3px] transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-400',
        sizeClassName,
        intensityClasses[day.intensity]
      )}
    />
  );
}
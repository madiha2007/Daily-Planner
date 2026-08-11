'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { DayActivity } from '@/lib/types';

const intensityClasses: Record<DayActivity['intensity'], string> = {
  0: 'bg-peach-50',
  1: 'bg-peach-200',
  2: 'bg-peach-300',
  3: 'bg-peach-500',
  4: 'bg-peach-600',
};

export default function HeatmapCell({
  day,
  index = 0,
  size = 13,
}: {
  day: DayActivity;
  index?: number;
  size?: number;
}) {
  const open = useOverlayStore((s) => s.open);
  const [hovered, setHovered] = useState(false);

  const dateLabel = format(parseISO(day.date), 'EEE, MMM d, yyyy');
  const ariaLabel = `${dateLabel}, activity level ${day.intensity} of 4`;

  const optionalDayData = day as unknown as {
    tasksCompleted?: number;
    habitsCompleted?: number;
    journalWritten?: boolean;
    completionPct?: number;
  };

  const tasksCompleted = optionalDayData.tasksCompleted;
  const habitsCompleted = optionalDayData.habitsCompleted;
  const journalWritten = optionalDayData.journalWritten;
  const completionPct = optionalDayData.completionPct;

  return (
    <div className="group relative shrink-0" style={{ width: size, height: size }}>
      <motion.button
        onClick={() => open('dayDetails', { date: day.date })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={ariaLabel}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.002, 0.4) }}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 1.05 }}
        className={cn(
          'block rounded-[3px] shadow-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-400',
          intensityClasses[day.intensity]
        )}
        style={{ width: size, height: size }}
      />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-44 -translate-x-1/2 rounded-xl border border-peach-100 bg-white/95 p-3 text-left shadow-warm backdrop-blur-sm"
          >
            <p className="text-[11px] font-semibold text-cocoa-800">{dateLabel}</p>
            <div className="mt-1.5 space-y-0.5 text-[10px] text-cocoa-500">
              {tasksCompleted !== undefined && <p>✔ {tasksCompleted} tasks completed</p>}
              {habitsCompleted !== undefined && <p>🔁 {habitsCompleted} habits completed</p>}
              {journalWritten !== undefined && <p>📖 {journalWritten ? 'Journal written' : 'No journal entry'}</p>}
              {completionPct !== undefined && <p>📊 {completionPct}% complete</p>}
              {tasksCompleted === undefined &&
                habitsCompleted === undefined &&
                journalWritten === undefined &&
                completionPct === undefined && <p>Activity level {day.intensity} of 4</p>}
            </div>
            <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-peach-100 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
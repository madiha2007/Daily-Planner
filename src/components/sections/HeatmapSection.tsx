'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, getDay, parseISO } from 'date-fns';
import Card from '@/components/ui/Card';
import HeatmapCell from '@/components/data/HeatmapCell';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHabitStore } from '@/stores/useHabitStore';
import { useDerivedActivity } from '@/hooks/useDerivedActivity';
import { DayActivity } from '@/lib/types';
import { cn } from '@/lib/utils';

const intensityLegend = [
  { level: 0, className: 'bg-peach-50' },
  { level: 1, className: 'bg-peach-200' },
  { level: 2, className: 'bg-peach-300' },
  { level: 3, className: 'bg-peach-400' },
  { level: 4, className: 'bg-peach-600' },
];

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Cell width scales up across breakpoints so fewer-column ranges (3M) fill more
// space on wide screens, while more-column ranges (1Y) stay compact everywhere.
const RANGE_OPTIONS = [
  {
    id: '3m',
    label: '3M',
    days: 91,
    cellClass: 'h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7',
    colClass: 'w-4 sm:w-5 md:w-6 lg:w-7',
    labelHeight: 'h-4 sm:h-5 md:h-6 lg:h-7',
  },
  {
    id: '6m',
    label: '6M',
    days: 182,
    cellClass: 'h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-[18px] lg:w-[18px]',
    colClass: 'w-3 sm:w-3.5 md:w-4 lg:w-[18px]',
    labelHeight: 'h-3 sm:h-3.5 md:h-4 lg:h-[18px]',
  },
  {
    id: '1y',
    label: '1Y',
    days: 365,
    cellClass: 'h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5',
    colClass: 'w-2 sm:w-2.5 md:w-3 lg:w-3.5',
    labelHeight: 'h-2 sm:h-2.5 md:h-3 lg:h-3.5',
  },
] as const;

type RangeId = (typeof RANGE_OPTIONS)[number]['id'];

export default function HeatmapSection() {
  const fetchTasks = useTaskStore((s) => s.fetchAll);
  const fetchHabits = useHabitStore((s) => s.fetchAll);
  const [range, setRange] = useState<RangeId>('3m');
  const activeRange = RANGE_OPTIONS.find((r) => r.id === range) ?? RANGE_OPTIONS[0];
  const days = useDerivedActivity(activeRange.days);

  useEffect(() => {
    fetchTasks();
    fetchHabits();
  }, [fetchTasks, fetchHabits]);

  const weeks = useMemo(() => {
    if (days.length === 0) return [];
    const firstDay = parseISO(days[0].date);
    const paddingDays = getDay(firstDay);
    const padded: (DayActivity | null)[] = [...Array(paddingDays).fill(null), ...days];
    const cols: (DayActivity | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      cols.push(padded.slice(i, i + 7));
    }
    return cols;
  }, [days]);

  const monthLabels = useMemo(() => {
    const labels: (string | null)[] = [];
    let lastMonth = '';
    weeks.forEach((week) => {
      const firstValidDay = week.find((d): d is DayActivity => d !== null);
      if (!firstValidDay) {
        labels.push(null);
        return;
      }
      const month = format(parseISO(firstValidDay.date), 'MMM');
      if (month !== lastMonth) {
        labels.push(month);
        lastMonth = month;
      } else {
        labels.push(null);
      }
    });
    return labels;
  }, [weeks]);

  return (
    <section id="heatmap" className="scroll-mt-20 rounded-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-cocoa-800">Activity Heatmap</h2>

        <div className="flex items-center gap-1 rounded-full border border-peach-200 bg-white p-1 shadow-soft">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setRange(opt.id)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                range === opt.id
                  ? 'bg-gradient-to-br from-peach-400 to-blush-400 text-white shadow-warm'
                  : 'text-cocoa-400 hover:bg-peach-50 hover:text-cocoa-600'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1">
            <div className="flex shrink-0 flex-col gap-1 pr-1" style={{ paddingTop: 18 }}>
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className={cn('flex items-center text-[10px] text-cocoa-400', activeRange.labelHeight)}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className={cn('flex flex-col gap-1', activeRange.colClass)}>
                  <div className="h-[18px] text-[10px] text-cocoa-400 whitespace-nowrap">
                    {monthLabels[wi] ?? ''}
                  </div>
                  {week.map((day, di) =>
                    day ? (
                      <HeatmapCell key={day.date} day={day} sizeClassName={activeRange.cellClass} />
                    ) : (
                      <div key={di} className={activeRange.cellClass} />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-cocoa-400">
          <span>Less</span>
          {intensityLegend.map((l) => (
            <div key={l.level} className={`h-3 w-3 rounded-[3px] ${l.className}`} />
          ))}
          <span>More</span>
        </div>
      </Card>
    </section>
  );
}
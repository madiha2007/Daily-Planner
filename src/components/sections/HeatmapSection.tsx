'use client';

import { useEffect, useMemo } from 'react';
import { format, getDay, parseISO } from 'date-fns';
import Card from '@/components/ui/Card';
import HeatmapCell from '@/components/data/HeatmapCell';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHabitStore } from '@/stores/useHabitStore';
import { useDerivedActivity } from '@/hooks/useDerivedActivity';
import { DayActivity } from '@/lib/types';

const intensityLegend = [
  { level: 0, className: 'bg-peach-50' },
  { level: 1, className: 'bg-peach-200' },
  { level: 2, className: 'bg-peach-300' },
  { level: 3, className: 'bg-peach-400' },
  { level: 4, className: 'bg-peach-600' },
];

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function HeatmapSection() {
  const fetchTasks = useTaskStore((s) => s.fetchAll);
  const fetchHabits = useHabitStore((s) => s.fetchAll);
  const days = useDerivedActivity(91);

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
      <h2 className="mb-4 text-lg font-semibold text-cocoa-800">Activity Heatmap</h2>
      <Card>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 w-max">
            <div className="flex flex-col gap-1 pt-[18px] pr-1 shrink-0">
              {WEEKDAY_LABELS.map((label, i) => (
                <div key={i} className="h-3.5 flex items-center text-[10px] text-cocoa-400">
                  {label}
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1 shrink-0">
                <div className="h-[14px] text-[10px] text-cocoa-400 whitespace-nowrap">
                  {monthLabels[wi] ?? ''}
                </div>
                {week.map((day, di) =>
                  day ? (
                    <HeatmapCell key={day.date} day={day} />
                  ) : (
                    <div key={di} className="h-3.5 w-3.5" />
                  )
                )}
              </div>
            ))}
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
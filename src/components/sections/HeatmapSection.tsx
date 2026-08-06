'use client';

import { useEffect, useMemo } from 'react';
import { getDay } from 'date-fns';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import HeatmapCell from '@/components/data/HeatmapCell';
import { useActivityStore } from '@/stores/useActivityStore';

const intensityLegend = [
  { level: 0, className: 'bg-peach-50' },
  { level: 1, className: 'bg-peach-200' },
  { level: 2, className: 'bg-peach-300' },
  { level: 3, className: 'bg-peach-400' },
  { level: 4, className: 'bg-peach-600' },
];

export default function HeatmapSection() {
  const { days, loading, fetchAll } = useActivityStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // group into weeks (columns), each column has 7 rows (Sun-Sat)
  const weeks = useMemo(() => {
    if (days.length === 0) return [];
    const firstDay = new Date(days[0].date);
    const paddingDays = getDay(firstDay);
    const padded = [...Array(paddingDays).fill(null), ...days];
    const cols: (typeof days[number] | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      cols.push(padded.slice(i, i + 7));
    }
    return cols;
  }, [days]);

  return (
    <section id="heatmap" className="scroll-mt-20 rounded-2xl">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">Activity Heatmap</h2>
      <Card>
        {loading ? (
          <Skeleton className="h-28 w-full" />
        ) : (
          <>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
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
            <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-neutral-400">
              <span>Less</span>
              {intensityLegend.map((l) => (
                <div key={l.level} className={`h-3 w-3 rounded-[3px] ${l.className}`} />
              ))}
              <span>More</span>
            </div>
          </>
        )}
      </Card>
    </section>
  );
}

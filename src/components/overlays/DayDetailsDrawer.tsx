'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import Drawer from '@/components/ui/Drawer';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { fetchDayActivityByDate } from '@/lib/api/activity';
import { DayActivity } from '@/lib/types';

export default function DayDetailsDrawer() {
  const payload = useOverlayStore((s) => s.payload) as { date: string } | null;
  const [activity, setActivity] = useState<DayActivity | null | undefined>(undefined);

  useEffect(() => {
    if (!payload?.date) return;
    let cancelled = false;
    setActivity(undefined);
    fetchDayActivityByDate(payload.date).then((data) => {
      if (!cancelled) setActivity(data ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [payload?.date]);

  if (!payload?.date) return null;

  const formattedDate = format(parseISO(payload.date), 'EEEE, MMMM d, yyyy');

  return (
    <Drawer title={formattedDate}>
      {activity === undefined && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {activity === null && (
        <p className="text-sm text-neutral-400">No activity recorded for this day.</p>
      )}

      {activity && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-700">Tasks</span>
              <Badge tone="emerald">
                {activity.tasksCompleted}/{activity.tasksTotal} done
              </Badge>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{
                  width: `${activity.tasksTotal ? (activity.tasksCompleted / activity.tasksTotal) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-700">Habits</span>
              <Badge tone="blue">
                {activity.habitsCompleted}/{activity.habitsTotal} done
              </Badge>
            </div>
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${activity.habitsTotal ? (activity.habitsCompleted / activity.habitsTotal) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="text-xs text-neutral-400">
            Activity intensity level: <span className="font-medium text-neutral-600">{activity.intensity}/4</span>
          </div>
        </div>
      )}
    </Drawer>
  );
}

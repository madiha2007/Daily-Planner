'use client';

import { format, parseISO } from 'date-fns';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { useDerivedActivity } from '@/hooks/useDerivedActivity';

export default function DayDetailsDrawer() {
  const payload = useOverlayStore((s) => s.payload) as { date: string } | null;
  const days = useDerivedActivity(91);

  if (!payload?.date) return null;

  const activity = days.find((d) => d.date === payload.date);
  const formattedDate = format(parseISO(payload.date), 'EEEE, MMMM d, yyyy');

  return (
    <Modal title={formattedDate} maxWidth="max-w-md">
      {!activity ? (
        <p className="text-sm text-cocoa-400">No activity recorded for this day.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-peach-200 bg-white p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-cocoa-700">Tasks</span>
              <Badge tone="peach">
                {activity.tasksCompleted}/{activity.tasksTotal} done
              </Badge>
            </div>
            <div className="h-2 rounded-full bg-peach-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-peach-400 to-peach-500"
                style={{
                  width: `${activity.tasksTotal ? (activity.tasksCompleted / activity.tasksTotal) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-peach-200 bg-white p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-cocoa-700">Habits</span>
              <Badge tone="blush">
                {activity.habitsCompleted}/{activity.habitsTotal} done
              </Badge>
            </div>
            <div className="h-2 rounded-full bg-blush-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blush-300 to-blush-400"
                style={{
                  width: `${activity.habitsTotal ? (activity.habitsCompleted / activity.habitsTotal) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="text-xs text-cocoa-400">
            Activity intensity level: <span className="font-medium text-cocoa-600">{activity.intensity}/4</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
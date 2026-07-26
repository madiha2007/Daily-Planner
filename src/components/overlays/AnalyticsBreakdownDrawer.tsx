'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Drawer from '@/components/ui/Drawer';
import Skeleton from '@/components/ui/Skeleton';
import { fetchDayActivity } from '@/lib/api/activity';
import { DayActivity } from '@/lib/types';

export default function AnalyticsBreakdownDrawer() {
  const [data, setData] = useState<DayActivity[] | null>(null);

  useEffect(() => {
    fetchDayActivity(14).then(setData);
  }, []);

  const chartData = (data ?? []).map((d) => ({
    date: format(parseISO(d.date), 'MMM d'),
    tasks: d.tasksCompleted,
    habits: d.habitsCompleted,
  }));

  return (
    <Drawer title="Analytics Breakdown" widthClass="w-full sm:w-[520px]">
      {!data ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700">Last 14 days</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 12 }}
                  />
                  <Bar dataKey="tasks" fill="#10b981" radius={[4, 4, 0, 0]} name="Tasks completed" />
                  <Bar dataKey="habits" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Habits completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 p-4">
              <p className="text-xs text-neutral-400">Avg tasks/day</p>
              <p className="text-xl font-semibold text-neutral-900">
                {(chartData.reduce((sum, d) => sum + d.tasks, 0) / (chartData.length || 1)).toFixed(1)}
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 p-4">
              <p className="text-xs text-neutral-400">Avg habits/day</p>
              <p className="text-xl font-semibold text-neutral-900">
                {(chartData.reduce((sum, d) => sum + d.habits, 0) / (chartData.length || 1)).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

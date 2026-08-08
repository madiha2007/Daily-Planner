'use client';

import { format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Modal from '@/components/ui/Modal';
import { useDerivedActivity } from '@/hooks/useDerivedActivity';

export default function AnalyticsBreakdownDrawer() {
  const days = useDerivedActivity(14);

  const chartData = days.map((d) => ({
    date: format(parseISO(d.date), 'MMM d'),
    tasks: d.tasksCompleted,
    habits: d.habitsCompleted,
  }));

  const avgTasks = (chartData.reduce((sum, d) => sum + d.tasks, 0) / (chartData.length || 1)).toFixed(1);
  const avgHabits = (chartData.reduce((sum, d) => sum + d.habits, 0) / (chartData.length || 1)).toFixed(1);

  return (
    <Modal title="Analytics Breakdown" maxWidth="max-w-xl">
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-sm font-medium text-cocoa-700">Last 14 days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5e0bf" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a6795f" />
                <YAxis tick={{ fontSize: 11 }} stroke="#a6795f" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #ffc9a3', fontSize: 12 }}
                />
                <Bar dataKey="tasks" fill="#f5804a" radius={[4, 4, 0, 0]} name="Tasks completed" />
                <Bar dataKey="habits" fill="#e5808f" radius={[4, 4, 0, 0]} name="Habits completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-peach-200 bg-white p-4">
            <p className="text-xs text-cocoa-400">Avg tasks/day</p>
            <p className="text-xl font-semibold text-cocoa-800">{avgTasks}</p>
          </div>
          <div className="rounded-xl border border-peach-200 bg-white p-4">
            <p className="text-xs text-cocoa-400">Avg habits/day</p>
            <p className="text-xl font-semibold text-cocoa-800">{avgHabits}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
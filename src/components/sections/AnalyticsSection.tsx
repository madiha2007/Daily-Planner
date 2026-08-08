'use client';

import { useEffect, useMemo } from 'react';
import AnalyticsCard from '@/components/data/AnalyticsCard';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHabitStore } from '@/stores/useHabitStore';
import { useDerivedActivity } from '@/hooks/useDerivedActivity';

export default function AnalyticsSection() {
  const fetchTasks = useTaskStore((s) => s.fetchAll);
  const fetchHabits = useHabitStore((s) => s.fetchAll);
  const days = useDerivedActivity(91);

  useEffect(() => {
    fetchTasks();
    fetchHabits();
  }, [fetchTasks, fetchHabits]);

  const recent = days.slice(-14);
  const tasksTrend = useMemo(() => recent.map((d) => ({ value: d.tasksCompleted })), [recent]);
  const habitsTrend = useMemo(() => recent.map((d) => ({ value: d.habitsCompleted })), [recent]);

  const totalTasks = recent.reduce((sum, d) => sum + d.tasksCompleted, 0);
  const totalHabits = recent.reduce((sum, d) => sum + d.habitsCompleted, 0);
  const avgIntensity = recent.length
    ? (recent.reduce((sum, d) => sum + d.intensity, 0) / recent.length).toFixed(1)
    : '0';

  return (
    <section id="analytics" className="scroll-mt-20 rounded-2xl">
      <h2 className="mb-4 text-lg font-semibold text-cocoa-800">Analytics</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AnalyticsCard title="Tasks completed (14d)" value={String(totalTasks)} trendData={tasksTrend} color="#f5804a" />
        <AnalyticsCard title="Habits completed (14d)" value={String(totalHabits)} trendData={habitsTrend} color="#e5808f" />
        <AnalyticsCard
          title="Avg. daily intensity"
          value={`${avgIntensity}/4`}
          trendData={recent.map((d) => ({ value: d.intensity }))}
          color="#a6795f"
        />
      </div>
    </section>
  );
}
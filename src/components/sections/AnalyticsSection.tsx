'use client';

import { useEffect, useMemo } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import AnalyticsCard from '@/components/data/AnalyticsCard';
import { useActivityStore } from '@/stores/useActivityStore';

export default function AnalyticsSection() {
  const { days, loading, fetchAll } = useActivityStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">Analytics</h2>
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AnalyticsCard title="Tasks completed (14d)" value={String(totalTasks)} trendData={tasksTrend} color="#10b981" />
          <AnalyticsCard title="Habits completed (14d)" value={String(totalHabits)} trendData={habitsTrend} color="#3b82f6" />
          <AnalyticsCard
            title="Avg. daily intensity"
            value={`${avgIntensity}/4`}
            trendData={recent.map((d) => ({ value: d.intensity }))}
            color="#a855f7"
          />
        </div>
      )}
    </section>
  );
}

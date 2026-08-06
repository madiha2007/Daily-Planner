'use client';

import { useEffect } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHabitStore } from '@/stores/useHabitStore';
import { useActivityStore } from '@/stores/useActivityStore';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { formatDateISO } from '@/lib/utils';

export default function OverviewSection() {
  const { tasks, loading: tasksLoading, fetchAll: fetchTasks } = useTaskStore();
  const { habits, loading: habitsLoading, fetchAll: fetchHabits } = useHabitStore();
  const { days, loading: activityLoading, fetchAll: fetchActivity } = useActivityStore();
  const scrollTo = useScrollToSection();

  useEffect(() => {
    fetchTasks();
    fetchHabits();
    fetchActivity();
  }, [fetchTasks, fetchHabits, fetchActivity]);

  const loading = tasksLoading || habitsLoading || activityLoading;

  const doneTasks = tasks.filter((t) => t.done).length;
  const progressPct = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;

  const today = formatDateISO(new Date());
  const habitsDoneToday = habits.filter((h) => h.completions.includes(today)).length;

  const currentStreak = (() => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].intensity > 0) streak++;
      else break;
    }
    return streak;
  })();

  const productivityScore = (() => {
    if (tasks.length === 0 && habits.length === 0) return '0/10';
    const taskScore = tasks.length ? doneTasks / tasks.length : 0;
    const habitScore = habits.length ? habitsDoneToday / habits.length : 0;
    const score = Math.round(((taskScore + habitScore) / 2) * 10);
    return `${score}/10`;
  })();

  const stats = [
    { label: "Today's Streak", value: String(currentStreak).padStart(2, '0'), target: 'heatmap' },
    { label: 'Progress Percentage', value: `${progressPct}%`, target: 'tasks' },
    { label: 'Productivity Score', value: productivityScore, target: 'analytics' },
  ];

  return (
    <div id="overview" className="scroll-mt-20 flex gap-3">
      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-peach-200 bg-white px-5 py-3 w-32 shadow-soft">
              <Skeleton className="h-6 w-12 mx-auto mb-2" />
              <Skeleton className="h-2 w-16 mx-auto" />
            </div>
          ))
        : stats.map((stat) => (
            <button
              key={stat.label}
              onClick={() => scrollTo(stat.target)}
              className="rounded-2xl border border-peach-200 bg-white px-5 py-3 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card w-32 shrink-0"
            >
              <p className="text-xl font-bold tracking-tight text-cocoa-800">{stat.value}</p>
              <p className="mt-1 text-[11px] leading-tight text-cocoa-400">{stat.label}</p>
            </button>
          ))}
    </div>
  );
}
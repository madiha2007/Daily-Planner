'use client';

import { useEffect } from 'react';
import { CheckSquare, Repeat, Flame, Target } from 'lucide-react';
import ProgressCard from '@/components/data/ProgressCard';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHabitStore } from '@/stores/useHabitStore';
import { useGoalStore } from '@/stores/useGoalStore';
import { useActivityStore } from '@/stores/useActivityStore';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { formatDateISO } from '@/lib/utils';

export default function OverviewSection() {
  const { tasks, loading: tasksLoading, fetchAll: fetchTasks } = useTaskStore();
  const { habits, loading: habitsLoading, fetchAll: fetchHabits } = useHabitStore();
  const { goals, loading: goalsLoading, fetchAll: fetchGoals } = useGoalStore();
  const { days, loading: activityLoading, fetchAll: fetchActivity } = useActivityStore();
  const scrollTo = useScrollToSection();

  useEffect(() => {
    fetchTasks();
    fetchHabits();
    fetchGoals();
    fetchActivity();
  }, [fetchTasks, fetchHabits, fetchGoals, fetchActivity]);

  const doneTasks = tasks.filter((t) => t.done).length;
  const today = formatDateISO(new Date());
  const habitsDoneToday = habits.filter((h) => h.completions.includes(today)).length;
  const avgGoalProgress = goals.length
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;
  const currentStreak = (() => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].intensity > 0) streak++;
      else break;
    }
    return streak;
  })();

  return (
    <section id="overview" className="scroll-mt-20 rounded-2xl">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProgressCard
          icon={CheckSquare}
          label="Tasks completed"
          value={`${doneTasks}/${tasks.length}`}
          tone="emerald"
          loading={tasksLoading}
          onClick={() => scrollTo('tasks')}
        />
        <ProgressCard
          icon={Repeat}
          label="Habits today"
          value={`${habitsDoneToday}/${habits.length}`}
          tone="blue"
          loading={habitsLoading}
          onClick={() => scrollTo('habits')}
        />
        <ProgressCard
          icon={Flame}
          label="Current streak"
          value={`${currentStreak} days`}
          tone="amber"
          loading={activityLoading}
          onClick={() => scrollTo('heatmap')}
        />
        <ProgressCard
          icon={Target}
          label="Goal progress"
          value={`${avgGoalProgress}%`}
          tone="purple"
          loading={goalsLoading}
          onClick={() => scrollTo('goals')}
        />
      </div>
    </section>
  );
}

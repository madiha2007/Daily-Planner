import { useMemo } from 'react';
import { subDays } from 'date-fns';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHabitStore } from '@/stores/useHabitStore';
import { DayActivity } from '@/lib/types';
import { formatDateISO, computeIntensity } from '@/lib/utils';

export function useDerivedActivity(days = 91): DayActivity[] {
  const tasks = useTaskStore((s) => s.tasks);
  const habits = useHabitStore((s) => s.habits);

  return useMemo(() => {
    const today = new Date();
    const result: DayActivity[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = formatDateISO(subDays(today, i));

      const dueTasks = tasks.filter((t) => t.dueDate === date);
      const tasksTotal = dueTasks.length;
      const tasksCompleted = dueTasks.filter((t) => t.done).length;

      const habitsTotal = habits.length;
      const habitsCompleted = habits.filter((h) => h.completions.includes(date)).length;

      const totalActions = tasksTotal + habitsTotal;
      const completedActions = tasksCompleted + habitsCompleted;

      result.push({
        date,
        tasksCompleted,
        tasksTotal,
        habitsCompleted,
        habitsTotal,
        intensity: computeIntensity(completedActions, totalActions),
      });
    }

    return result;
  }, [tasks, habits, days]);
}
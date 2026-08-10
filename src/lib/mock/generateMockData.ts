import { addDays, subDays } from 'date-fns';
import { Task, Habit, JournalEntry, Goal, DayActivity } from '@/lib/types';
import { formatDateISO, uid, computeIntensity } from '@/lib/utils';

const TASK_TITLES = [
  'Review calculus problem set',
  'Read chapter 4 for seminar',
  'Draft essay outline',
  'Lab report write-up',
  'Group project sync',
  'Study for chemistry quiz',
  'Email professor about extension',
  'Organize class notes',
];

export function generateMockTasks(): Task[] {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const dueDate = addDays(today, i - 2);
    return {
      id: uid(),
      title: TASK_TITLES[i % TASK_TITLES.length],
      done: Math.random() > 0.55,
      priority: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)],
      dueDate: formatDateISO(dueDate),
      createdAt: formatDateISO(subDays(today, 10)),
    };
  });
}

export function generateMockHabits(): Habit[] {
  const today = new Date();
  const habitDefs = [
    { title: 'Morning reading', color: 'emerald', targetPerWeek: 5 },
    { title: 'Exercise', color: 'blue', targetPerWeek: 4 },
    { title: 'No phone after 10pm', color: 'purple', targetPerWeek: 6 },
  ];

  return habitDefs.map((def) => {
    const completions: string[] = [];
    for (let i = 0; i < 21; i++) {
      if (Math.random() > 0.45) {
        completions.push(formatDateISO(subDays(today, i)));
      }
    }
    return {
      id: uid(),
      title: def.title,
      targetPerWeek: def.targetPerWeek,
      completions,
      color: def.color,
      createdAt: formatDateISO(subDays(today, 30)),
    };
  });
}

export function generateMockJournal(): JournalEntry[] {
  const today = new Date();
  const moods: JournalEntry['mood'][] = ['great', 'good', 'okay', 'low', 'rough'];
  return Array.from({ length: 4 }).map((_, i) => ({
  id: uid(),

  title: `Journal ${i + 1}`,

  content:
    i === 0
      ? "Today was productive..."
      : "Had a normal day.",

  mood: moods[i],

  color: "#FFE6E2",

  stickers: [],

  imagePosition: "top",

  createdAt: today.toISOString(),
}));
}

export function generateMockGoals(): Goal[] {
  const today = new Date();
  return [
    {
      id: uid(),
      title: 'Finish semester with a 3.8 GPA',
      description: 'Stay consistent with weekly study blocks across all courses.',
      progress: 62,
      targetDate: formatDateISO(addDays(today, 60)),
      milestones: [
        { id: uid(), label: 'Midterms completed', done: true },
        { id: uid(), label: 'Research paper submitted', done: false },
        { id: uid(), label: 'Finals prep started', done: false },
      ],
      createdAt: formatDateISO(subDays(today, 45)),
    },
    {
      id: uid(),
      title: 'Build a consistent sleep schedule',
      progress: 40,
      targetDate: formatDateISO(addDays(today, 30)),
      milestones: [
        { id: uid(), label: 'Sleep by midnight for 2 weeks', done: true },
        { id: uid(), label: 'No screens 30 min before bed', done: false },
      ],
      createdAt: formatDateISO(subDays(today, 20)),
    },
  ];
}

/**
 * Generates a rolling window of day-activity records for the heatmap.
 * Intensity is always derived via computeIntensity, never hardcoded.
 */
export function generateMockDayActivity(days = 91): DayActivity[] {
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(today, days - 1 - i);
    const tasksTotal = Math.floor(Math.random() * 5) + 1;
    const tasksCompleted = Math.floor(Math.random() * (tasksTotal + 1));
    const habitsTotal = Math.floor(Math.random() * 3) + 1;
    const habitsCompleted = Math.floor(Math.random() * (habitsTotal + 1));
    const totalActions = tasksTotal + habitsTotal;
    const completedActions = tasksCompleted + habitsCompleted;

    return {
      date: formatDateISO(date),
      tasksCompleted,
      tasksTotal,
      habitsCompleted,
      habitsTotal,
      intensity: computeIntensity(completedActions, totalActions),
    };
  });
}

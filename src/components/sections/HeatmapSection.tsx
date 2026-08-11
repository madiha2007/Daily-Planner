'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, getDay, parseISO } from 'date-fns';
import { Flame, CheckCircle2, BookOpen, Target } from 'lucide-react';
import Card from '@/components/ui/Card';
import HeatmapCell from '@/components/data/HeatmapCell';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHabitStore } from '@/stores/useHabitStore';
import { useJournalStore } from '@/stores/useJournalStore';
import { useGoalStore } from '@/stores/useGoalStore';
import { useDerivedActivity } from '@/hooks/useDerivedActivity';
import { DayActivity } from '@/lib/types';
import { cn } from '@/lib/utils';

const intensityLegend = [
  { level: 0, className: 'bg-peach-50' },
  { level: 1, className: 'bg-peach-200' },
  { level: 2, className: 'bg-peach-300' },
  { level: 3, className: 'bg-peach-500' },
  { level: 4, className: 'bg-peach-600' },
];

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Cell size is fixed per range (like GitHub's contribution graph) — never
// stretches to fill the card, so it stays visually consistent and never
// blows past a sane height regardless of how few/many weeks are shown.
const RANGE_OPTIONS = [
  { id: '3m', label: '3M', days: 91, cellSize: 14, gap: 4 },
  { id: '6m', label: '6M', days: 182, cellSize: 14, gap: 3 },
  { id: '1y', label: '1Y', days: 365, cellSize: 14, gap: 2 },
] as const;

type RangeId = (typeof RANGE_OPTIONS)[number]['id'];

export default function HeatmapSection() {
  const fetchTasks = useTaskStore((s) => s.fetchAll);
  const fetchHabits = useHabitStore((s) => s.fetchAll);
  const tasks = useTaskStore((s) => s.tasks);
  const habits = useHabitStore((s) => s.habits);

  const fetchJournal = useJournalStore((s) => s.fetchAll);
  const journalEntries = useJournalStore((s) => s.entries);

  const fetchGoals = useGoalStore((s) => s.fetchAll);
  const goals = useGoalStore((s) => s.goals);

  const [range, setRange] = useState<RangeId>('3m');
  const activeRange = RANGE_OPTIONS.find((r) => r.id === range) ?? RANGE_OPTIONS[0];
  const days = useDerivedActivity(activeRange.days);

  useEffect(() => {
    fetchTasks();
    fetchHabits();
    fetchJournal?.();
    fetchGoals?.();
  }, [fetchTasks, fetchHabits, fetchJournal, fetchGoals]);

  const weeks = useMemo(() => {
    if (days.length === 0) return [];
    const firstDay = parseISO(days[0].date);
    const paddingDays = getDay(firstDay);
    const padded: (DayActivity | null)[] = [...Array(paddingDays).fill(null), ...days];
    const cols: (DayActivity | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      cols.push(padded.slice(i, i + 7));
    }
    return cols;
  }, [days]);

  const monthLabels = useMemo(() => {
    const labels: (string | null)[] = [];
    let lastMonth = '';
    weeks.forEach((week) => {
      const firstValidDay = week.find((d): d is DayActivity => d !== null);
      if (!firstValidDay) {
        labels.push(null);
        return;
      }
      const month = format(parseISO(firstValidDay.date), 'MMM');
      if (month !== lastMonth) {
        labels.push(month);
        lastMonth = month;
      } else {
        labels.push(null);
      }
    });
    return labels;
  }, [weeks]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].intensity > 0) streak++;
      else break;
    }
    return streak;
  }, [days]);

  const taskCompletionPct = useMemo(() => {
    if (!tasks?.length) return 0;
    const done = tasks.filter((t) => t.done).length;
    return Math.round((done / tasks.length) * 100);
  }, [tasks]);

  const journalCount = journalEntries?.length ?? 0;

  const goalsCompleted = useMemo(() => {
    if (!goals?.length) return 0;
    return goals.filter((g) => {
      const completed = 'completed' in g ? Boolean((g as { completed?: boolean }).completed) : false;
      const done = 'done' in g ? Boolean((g as { done?: boolean }).done) : false;
      return completed || done;
    }).length;
  }, [goals]);

  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak} days`,
      tint: 'text-orange-500',
    },
    {
      icon: CheckCircle2,
      label: 'Task Completion',
      value: `${taskCompletionPct}%`,
      tint: 'text-peach-600',
    },
    {
      icon: BookOpen,
      label: 'Journal Entries',
      value: `${journalCount}`,
      tint: 'text-blush-500',
    },
    {
      icon: Target,
      label: 'Goals Completed',
      value: `${goalsCompleted}`,
      tint: 'text-cocoa-500',
    },
  ];

  const { cellSize, gap } = activeRange;
  const labelColWidth = 24;

  return (
    <motion.section
      id="heatmap"
      className="scroll-mt-20 rounded-2xl"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-cocoa-800">Activity Heatmap</h2>

        <div className="flex items-center gap-1 rounded-full border border-peach-200 bg-white/80 p-1 shadow-soft backdrop-blur-sm">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setRange(opt.id)}
              className={cn(
                'relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                range === opt.id ? 'text-white' : 'text-cocoa-400 hover:text-cocoa-600'
              )}
            >
              {range === opt.id && (
                <motion.span
                  layoutId="heatmap-range-pill"
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-peach-400 to-blush-400 shadow-warm"
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Card className="rounded-3xl border border-peach-100/70 bg-white/70 p-5 shadow-warm backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 min-w-0">
            <div className="max-h-[55vh] overflow-x-auto overflow-y-hidden pb-2">
              <div className="inline-flex gap-2">
                {/* Weekday labels — fixed width, fixed row heights matching cell size exactly */}
                <div
                  className="flex shrink-0 flex-col"
                  style={{ gap, paddingTop: 20, width: labelColWidth }}
                >
                  {WEEKDAY_LABELS.map((label, i) => (
                    <div
                      key={i}
                      className="flex items-center text-[10px] text-cocoa-400"
                      style={{ height: cellSize }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Week columns — each cell is a fixed px size, never stretched.
                Row width = natural content width, so there's no leftover
                empty space and no forced-huge cells at low week counts. */}
                <div className="flex" style={{ gap }}>
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col" style={{ gap }}>
                      <div
                        className="text-[10px] font-medium text-cocoa-400 whitespace-nowrap"
                        style={{ height: 18 }}
                      >
                        {monthLabels[wi] ?? ''}
                      </div>
                      {week.map((day, di) =>
                        day ? (
                          <HeatmapCell key={day.date} day={day} index={wi * 7 + di} size={cellSize} />
                        ) : (
                          <div key={di} style={{ width: cellSize, height: cellSize }} />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-cocoa-400">
              <span>Less</span>
              {intensityLegend.map((l) => (
                <div key={l.level} className={cn('h-3 w-3 rounded-[3px]', l.className)} />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="grid w-full shrink-0 gap-2 lg:w-24">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                className="group relative flex items-center gap-4 rounded-2xl border border-peach-100/70 bg-white/80 p-2 shadow-soft backdrop-blur-sm"
              >
                <stat.icon size={16} className={cn('mb-1', stat.tint)} />
                <p className="text-sm text-cocoa-800">{stat.value}</p>
                {/* <p className="text-[10px] leading-tight text-cocoa-400">{stat.label}</p> */}
                <span
                  className="pointer-events-none absolute left-1/2 -top-4 -translate-x-1/2 whitespace-nowrap rounded-full bg-cocoa-700 px-3 py-1 text-xs font-medium text-white opacity-0 transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 shadow-warm">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.section>
  );
}
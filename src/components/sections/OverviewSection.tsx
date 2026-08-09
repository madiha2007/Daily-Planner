'use client';

import { useEffect } from 'react';
import { Flame } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHabitStore } from '@/stores/useHabitStore';
import { useDerivedActivity } from '@/hooks/useDerivedActivity';
import { useScrollToSection } from '@/hooks/useScrollToSection';
import { formatDateISO } from '@/lib/utils';

function AnimatedFlame() {
  return (
    <div className="relative flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center">
      <Flame
        className="absolute text-red-500 animate-flame-a"
        size={40}
        fill="currentColor"
      />
      <Flame
        className="absolute text-orange-400 animate-flame-b"
        size={30}
        fill="currentColor"
      />
      <Flame
        className="absolute text-yellow-300 animate-flame-c"
        size={18}
        fill="currentColor"
      />
      <style jsx global>{`
        @keyframes flame-a {
          0%, 100% { transform: scale(1) rotate(-3deg); opacity: 0.85; }
          50% { transform: scale(1.1) rotate(3deg); opacity: 1; }
        }
        @keyframes flame-b {
          0%, 100% { transform: scale(0.92) rotate(3deg) translateY(0); }
          50% { transform: scale(1.08) rotate(-4deg) translateY(-1.5px); }
        }
        @keyframes flame-c {
          0%, 100% { transform: scale(0.88) translateY(0); opacity: 0.9; }
          50% { transform: scale(1.15) translateY(-2.5px); opacity: 1; }
        }
        .animate-flame-a {
          animation: flame-a 1.6s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .animate-flame-b {
          animation: flame-b 1.3s ease-in-out infinite;
          animation-delay: 0.15s;
          transform-origin: bottom center;
        }
        .animate-flame-c {
          animation: flame-c 1s ease-in-out infinite;
          animation-delay: 0.3s;
          transform-origin: bottom center;
        }
      `}</style>
    </div>
  );
}

function CircularStat({
  percent,
  size = 52,
  strokeWidth = 5,
  trackClassName,
  progressClassName,
  children,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  trackClassName: string;
  progressClassName: string;
  children: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${progressClassName} transition-all duration-700 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function OverviewSection() {
  const { tasks, loading: tasksLoading, fetchAll: fetchTasks } = useTaskStore();
  const { habits, loading: habitsLoading, fetchAll: fetchHabits } = useHabitStore();
  const days = useDerivedActivity(91);
  const scrollTo = useScrollToSection();

  useEffect(() => {
    fetchTasks();
    fetchHabits();
  }, [fetchTasks, fetchHabits]);

  const loading = tasksLoading || habitsLoading;

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

  const productivityRaw = (() => {
    if (tasks.length === 0 && habits.length === 0) return 0;
    const taskScore = tasks.length ? doneTasks / tasks.length : 0;
    const habitScore = habits.length ? habitsDoneToday / habits.length : 0;
    return Math.round(((taskScore + habitScore) / 2) * 10);
  })();
  const productivityScore = `${productivityRaw}/10`;

  if (loading) {
    return (
      <div id="overview" className="scroll-mt-20 grid grid-cols-3 gap-2 sm:gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-3xl border border-peach-200 bg-white flex flex-col items-center justify-center gap-2 shadow-soft"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-2 w-14" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div id="overview" className="scroll-mt-20 grid grid-cols-3 gap-2 sm:gap-3">
      {/* Streak card */}
<button
  onClick={() => scrollTo('heatmap')}
  className="relative overflow-hidden aspect-square rounded-xl bg-gradient-to-r from-peach-400 to-blush-400 flex flex-row items-center justify-center gap-2 px-2 shadow-warm transition-all hover:-translate-y-0.5 hover:shadow-card"
>
  <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/20 blur-xl" />
  <AnimatedFlame />
  <div className="relative flex flex-col items-start">
    <p className="text-lg sm:text-2xl font-bold tracking-tight text-white leading-none">
      {String(currentStreak).padStart(2, '0')}
    </p>
    <p className="mt-1 text-[10px] sm:text-[11px] leading-tight text-white/85">
      Streak Days
    </p>
  </div>
</button>
      {/* Progress percentage card */}
      <button
        onClick={() => scrollTo('tasks')}
        className="aspect-square rounded-xl border border-peach-200 bg-gradient-to-r from-peach-400 to-blush-400 flex flex-col items-center justify-center gap-1.5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
      >
        <CircularStat
          percent={progressPct}
          trackClassName="text-peach-100"
          progressClassName="text-red-500"
        >
          <span className="text-xs sm:text-sm font-bold text-white">{progressPct}%</span>
        </CircularStat>
        <p className="text-[10px] sm:text-[11px] leading-tight text-white/85 text-center px-1">
          Progress Percentage
        </p>
      </button>

      {/* Productivity score card */}
      <button
        onClick={() => scrollTo('analytics')}
        className="aspect-square rounded-xl border border-peach-200 bg-gradient-to-r from-peach-400 to-blush-400 flex flex-col items-center justify-center gap-1.5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
      >
        <CircularStat
          percent={productivityRaw * 10}
          trackClassName="text-blush-100"
          progressClassName="text-orange-700"
        >
          <span className="text-xs sm:text-sm font-bold text-white">{productivityScore}</span>
        </CircularStat>
        <p className="text-[10px] sm:text-[11px] leading-tight text-white/85 text-center px-1">
          Productivity Score
        </p>
      </button>
    </div>
  );
}
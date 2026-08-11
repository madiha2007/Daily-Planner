'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
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
      <Flame className="absolute text-red-500 animate-flame-a" size={40} fill="currentColor" />
      <Flame className="absolute text-orange-400 animate-flame-b" size={30} fill="currentColor" />
      <Flame className="absolute text-yellow-300 animate-flame-c" size={18} fill="currentColor" />
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
        .animate-flame-a { animation: flame-a 1.6s ease-in-out infinite; transform-origin: bottom center; }
        .animate-flame-b { animation: flame-b 1.3s ease-in-out infinite; animation-delay: 0.15s; transform-origin: bottom center; }
        .animate-flame-c { animation: flame-c 1s ease-in-out infinite; animation-delay: 0.3s; transform-origin: bottom center; }
      `}</style>
    </div>
  );
}

// --- Apple-Activity-style ring, adapted: SVG gradient stroke + animated draw-in ---
interface RingDatum {
  id: string;
  percent: number; // 0-100
  size: number;
  colorFrom: string;
  colorTo: string;
}

function GradientRing({ data, delay }: { data: RingDatum; delay: number }) {
  const strokeWidth = 10;
  const radius = (data.size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clamped = Math.min(100, Math.max(0, data.percent));
  const offset = circumference - (clamped / 100) * circumference;
  const gradientId = `gradient-${data.id}`;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        width={data.size}
        height={data.size}
        viewBox={`0 0 ${data.size} ${data.size}`}
        className="-rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={data.colorFrom} />
            <stop offset="100%" stopColor={data.colorTo} />
          </linearGradient>
        </defs>

        <circle
          cx={data.size / 2}
          cy={data.size / 2}
          r={radius}
          fill="none"
          stroke="#aca9a9"
          strokeOpacity={0.3}
          strokeWidth={strokeWidth}
        />

        <motion.circle
          cx={data.size / 2}
          cy={data.size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, delay, ease: 'easeInOut' }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.15))' }}
        />
      </svg>
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

  const rings: RingDatum[] = [
    { id: 'progress', percent: progressPct, size: 96, colorFrom: '#116082', colorTo: '#93f8ff' }, // peach
    { id: 'productivity', percent: productivityRaw * 10, size: 68, colorFrom: '#f81084', colorTo: '#fea6d8' }, // blush
  ];

  if (loading) {
    return (
      <div id="overview" className="scroll-mt-20 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="aspect-square rounded-3xl border border-peach-200 bg-white flex flex-col items-center justify-center gap-2 shadow-soft">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-2 w-14" />
        </div>
        <div className="col-span-2 rounded-3xl border border-peach-200 bg-white p-4 shadow-soft">
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div id="overview" className="scroll-mt-20 grid grid-cols-3 gap-2 sm:gap-3">
      {/* Streak card */}
      <button
        onClick={() => scrollTo('heatmap')}
        className="relative overflow-hidden aspect-square rounded-2xl bg-white/40  flex flex-row items-center justify-center gap-2 px-2 shadow-warm transition-all hover:-translate-y-0.5 hover:shadow-card"
      >
        <div className="pointer-events-none absolute -right-3 -top-3 h-14 w-14 rounded-full blur-xl" />
        <AnimatedFlame />
        <div className="relative flex flex-col items-start">
          <p className="text-3xl sm:text-2xl font-bold tracking-tight text-cocoa-800 leading-none">
            {String(currentStreak).padStart(1, '0')}
          </p>
          <p className="mt-1 text-[10px] sm:text-[13px] leading-tight text-cocoa-800">
            Streak Days
          </p>
        </div>
      </button>

      {/* Merged Activity card — Apple Activity Rings style */}
      <button
        onClick={() => scrollTo('analytics')}
        className="col-span-2 rounded-xl bg-white/40 shadow-warm transition-all hover:-translate-y-0.5 hover:shadow-card px-4 py-3 flex items-center justify-center gap-4 sm:gap-6"
      >
        <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
          {rings.map((ring, i) => (
            <GradientRing key={ring.id} data={ring} delay={i * 0.2} />
          ))}
        </div>

        <div className="flex flex-col gap-2 text-left">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-cocoa-800">
              PROGRESS
            </span>
            <span className="text-sm sm:text-lg font-bold text-sky-400 leading-none">
              {progressPct}
              <span className="ml-0.5 text-[10px] sm:text-xs font-medium text-cocoa-800/80">%</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-cocoa-800">
              PRODUCTIVITY
            </span>
            <span className="text-sm sm:text-lg font-bold text-pink-400 leading-none">
              {productivityScore}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
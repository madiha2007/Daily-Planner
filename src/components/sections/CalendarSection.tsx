'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  format,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import CalendarDay from '@/components/data/CalendarDay';
import { useTaskStore } from '@/stores/useTaskStore';
import { formatDateISO } from '@/lib/utils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarSection() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { tasks, fetchAll } = useTaskStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const taskCountByDate = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      map[t.dueDate] = (map[t.dueDate] ?? 0) + 1;
    });
    return map;
  }, [tasks]);

  return (
    <section id="calendar" className="scroll-mt-20 rounded-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-cocoa-800">Calendar</h2>
        <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-peach-400 to-blush-400 px-1 py-1 text-white shadow-warm">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            aria-label="Previous month"
            className="rounded-full p-1 hover:bg-white/20"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-medium px-1 w-20 text-center">
            {format(currentMonth, 'MMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            aria-label="Next month"
            className="rounded-full p-1 hover:bg-white/20"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-cocoa-400 py-1">
              {d[0]}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((date) => (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              currentMonth={currentMonth}
              taskCount={taskCountByDate[formatDateISO(date)] ?? 0}
            />
          ))}
        </div>
      </Card>
    </section>
  );
}
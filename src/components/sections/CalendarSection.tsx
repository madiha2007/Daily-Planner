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
        <h2 className="text-lg font-semibold text-neutral-900">Calendar</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            aria-label="Previous month"
            className="rounded-lg p-1.5 hover:bg-neutral-100 text-neutral-500"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-neutral-700 w-32 text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            aria-label="Next month"
            className="rounded-lg p-1.5 hover:bg-neutral-100 text-neutral-500"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-neutral-400 py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
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

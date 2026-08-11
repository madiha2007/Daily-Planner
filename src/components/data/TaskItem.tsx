'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { useTaskStore } from '@/stores/useTaskStore';
import { useOverlayStore } from '@/stores/useOverlayStore';

const priorityTone: Record<Task['priority'], 'red' | 'peach' | 'neutral'> = {
  high: 'red',
  medium: 'peach',
  low: 'neutral',
};

export default function TaskItem({ task }: { task: Task }) {
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const open = useOverlayStore((s) => s.open);

  return (
    <div
      className={cn(
        'group flex items-center gap-2 sm:gap-3 rounded-xl border border-transparent p-2.5 sm:p-3 transition-all',
        'hover:border-peach-100 hover:bg-peach-50/60'
      )}
    >
      <button
        onClick={() => toggleTask(task.id)}
        aria-label={task.done ? 'Mark task incomplete' : 'Mark task complete'}
        className={cn(
          'h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors',
          task.done ? 'border-peach-400 bg-peach-400' : 'border-peach-200'
        )}
      >
        {task.done && <div className="h-2 w-2 rounded-sm bg-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm text-cocoa-800 truncate', task.done && 'line-through text-cocoa-300')}>
          {task.title}
        </p>
        {task.notes && <p className="text-xs text-cocoa-400 truncate">{task.notes}</p>}
      </div>

      <div className="shrink-0 hidden xs:inline-flex sm:inline-flex">
        <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => open('editTask', { task })}
          aria-label="Edit task"
          className="rounded-lg p-1.5 text-cocoa-300 hover:bg-peach-100 hover:text-cocoa-600 active:bg-peach-100"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => open('deleteTask', { task })}
          aria-label="Delete task"
          className="rounded-lg p-1.5 text-cocoa-300 hover:bg-red-50 hover:text-red-400 active:bg-red-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
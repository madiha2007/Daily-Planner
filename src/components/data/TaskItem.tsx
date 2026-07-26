'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { useTaskStore } from '@/stores/useTaskStore';
import { useOverlayStore } from '@/stores/useOverlayStore';

const priorityTone: Record<Task['priority'], 'red' | 'amber' | 'neutral'> = {
  high: 'red',
  medium: 'amber',
  low: 'neutral',
};

export default function TaskItem({ task }: { task: Task }) {
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const open = useOverlayStore((s) => s.open);

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all',
        'hover:border-neutral-200 hover:bg-neutral-50'
      )}
    >
      <button
        onClick={() => toggleTask(task.id)}
        aria-label={task.done ? 'Mark task incomplete' : 'Mark task complete'}
        className={cn(
          'h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors',
          task.done ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300'
        )}
      >
        {task.done && <div className="h-2 w-2 rounded-sm bg-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm text-neutral-800 truncate', task.done && 'line-through text-neutral-400')}>
          {task.title}
        </p>
        {task.notes && <p className="text-xs text-neutral-400 truncate">{task.notes}</p>}
      </div>

      <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => open('editTask', { task })}
          aria-label="Edit task"
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => open('deleteTask', { task })}
          aria-label="Delete task"
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

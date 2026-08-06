'use client';

import { useEffect } from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import TaskItem from '@/components/data/TaskItem';
import { useTaskStore } from '@/stores/useTaskStore';
import { useOverlayStore } from '@/stores/useOverlayStore';

export default function TasksSection() {
  const { tasks, loading, fetchAll } = useTaskStore();
  const open = useOverlayStore((s) => s.open);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <section id="tasks" className="scroll-mt-20 rounded-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Today&apos;s Tasks</h2>
        <button
          onClick={() => open('addTask')}
          aria-label="Add task"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-peach-300 text-white hover:bg-peach-600"
        >
          <Plus size={16} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <EmptyState
            icon={CheckSquare}
            title="No tasks yet"
            message="Add your first task to get started."
            action={
              <Button size="sm" onClick={() => open('addTask')}>
                <Plus size={15} /> Add Task
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="p-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </Card>
      )}
    </section>
  );
}

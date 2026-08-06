'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useTaskStore } from '@/stores/useTaskStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { formatDateISO } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  notes: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().min(1, 'Due date is required'),
});

type FormValues = z.infer<typeof schema>;

export default function AddTaskModal() {
  const addTask = useTaskStore((s) => s.addTask);
  const close = useOverlayStore((s) => s.close);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      notes: '',
      priority: 'medium',
      dueDate: formatDateISO(new Date()),
    },
  });

  const onSubmit = async (values: FormValues) => {
    await addTask({ ...values, done: false });
    close();
  };

  return (
    <Modal title="Add Task" description="Create a new task for your planner.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Title" placeholder="e.g. Finish reading assignment" {...register('title')} error={errors.title?.message} />
        <Textarea label="Notes (optional)" rows={3} placeholder="Any extra detail..." {...register('notes')} error={errors.notes?.message} />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">Priority</label>
            <select
              {...register('priority')}
              className="rounded-xl border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-peach-300"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <Input label="Due date" type="date" {...register('dueDate')} error={errors.dueDate?.message} />
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

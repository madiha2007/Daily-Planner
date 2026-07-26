'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useHabitStore } from '@/stores/useHabitStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { Habit } from '@/lib/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  targetPerWeek: z.coerce.number().min(1).max(7),
});

type FormValues = z.infer<typeof schema>;

export default function EditHabitModal() {
  const payload = useOverlayStore((s) => s.payload) as { habit: Habit } | null;
  const editHabit = useHabitStore((s) => s.editHabit);
  const removeHabit = useHabitStore((s) => s.removeHabit);
  const close = useOverlayStore((s) => s.close);
  const habit = payload?.habit;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: habit?.title ?? '',
      targetPerWeek: habit?.targetPerWeek ?? 5,
    },
  });

  if (!habit) return null;

  const onSubmit = async (values: FormValues) => {
    await editHabit(habit.id, values);
    close();
  };

  const handleDelete = async () => {
    await removeHabit(habit.id);
    close();
  };

  return (
    <Modal title="Edit Habit">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Habit name" {...register('title')} error={errors.title?.message} />
        <Input
          label="Target per week"
          type="number"
          min={1}
          max={7}
          {...register('targetPerWeek')}
          error={errors.targetPerWeek?.message}
        />
        <div className="mt-2 flex justify-between gap-2">
          <Button type="button" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

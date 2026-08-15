'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useHabitStore } from '@/stores/useHabitStore';
import { useOverlayStore } from '@/stores/useOverlayStore';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  targetPerWeek: z.number().min(1).max(7),
});

type FormValues = z.infer<typeof schema>;

export default function AddHabitModal() {
  const addHabit = useHabitStore((s) => s.addHabit);
  const close = useOverlayStore((s) => s.close);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', targetPerWeek: 5 },
  });

  const onSubmit = async (values: FormValues) => {
    await addHabit(values);
    close();
  };

  return (
    <Modal title="Add Habit" description="Track a new recurring habit.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Habit name" placeholder="e.g. Morning reading" {...register('title')} error={errors.title?.message} />
        <Input
          label="Target per week"
          type="number"
          min={1}
          max={7}
          {...register('targetPerWeek', { valueAsNumber: true })}
          error={errors.targetPerWeek?.message}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

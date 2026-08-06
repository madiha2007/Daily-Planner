'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useGoalStore } from '@/stores/useGoalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { uid, formatDateISO } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  targetDate: z.string().min(1, 'Target date is required'),
  milestonesText: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddGoalModal() {
  const addGoal = useGoalStore((s) => s.addGoal);
  const close = useOverlayStore((s) => s.close);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      targetDate: formatDateISO(new Date()),
      milestonesText: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    const milestones = (values.milestonesText ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((label) => ({ id: uid(), label, done: false }));

    await addGoal({
      title: values.title,
      description: values.description,
      targetDate: values.targetDate,
      progress: 0,
      milestones,
    });
    close();
  };

  return (
    <Modal title="Add Goal" description="Set a new goal to work towards.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Goal title"
          placeholder="e.g. Finish semester with a 3.8 GPA"
          {...register('title')}
          error={errors.title?.message}
        />
        <Textarea
          label="Description (optional)"
          rows={2}
          placeholder="Why this goal matters..."
          {...register('description')}
        />
        <Input label="Target date" type="date" {...register('targetDate')} error={errors.targetDate?.message} />
        <Textarea
          label="Milestones (optional, one per line)"
          rows={3}
          placeholder={'Midterms completed\nResearch paper submitted'}
          {...register('milestonesText')}
        />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
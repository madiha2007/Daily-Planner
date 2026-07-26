'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { useJournalStore } from '@/stores/useJournalStore';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { cn } from '@/lib/utils';

const schema = z.object({
  content: z.string().min(1, 'Write something first').max(2000),
  mood: z.enum(['great', 'good', 'okay', 'low', 'rough']),
});

type FormValues = z.infer<typeof schema>;

const moods: { value: FormValues['mood']; label: string; emoji: string }[] = [
  { value: 'great', label: 'Great', emoji: '😄' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'low', label: 'Low', emoji: '😔' },
  { value: 'rough', label: 'Rough', emoji: '😣' },
];

export default function AddJournalModal() {
  const addEntry = useJournalStore((s) => s.addEntry);
  const close = useOverlayStore((s) => s.close);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { content: '', mood: 'good' },
  });

  const selectedMood = watch('mood');

  const onSubmit = async (values: FormValues) => {
    await addEntry(values);
    close();
  };

  return (
    <Modal title="New Journal Entry" description="Reflect on your day.">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">How are you feeling?</label>
          <div className="flex gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setValue('mood', m.value)}
                className={cn(
                  'flex-1 rounded-xl border px-2 py-2 text-center text-xs transition-colors',
                  selectedMood === m.value
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                    : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                )}
              >
                <div className="text-base">{m.emoji}</div>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Entry"
          rows={6}
          placeholder="What's on your mind today?"
          {...register('content')}
          error={errors.content?.message}
        />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

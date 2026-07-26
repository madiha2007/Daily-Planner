'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useOverlayStore } from '@/stores/useOverlayStore';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  timezone: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

// Placeholder profile - replace with data fetched from your auth/user store.
const currentProfile: FormValues = {
  name: 'Madiha',
  email: 'madiha@example.com',
  timezone: 'Asia/Kolkata',
};

export default function ProfileSettingsModal() {
  const close = useOverlayStore((s) => s.close);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: currentProfile,
  });

  const onSubmit = async (values: FormValues) => {
    // Phase 2: call updateProfile(values) against your real API
    console.log('Profile updated:', values);
    close();
  };

  return (
    <Modal title="Profile & Settings">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" {...register('name')} error={errors.name?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Timezone" {...register('timezone')} error={errors.timezone?.message} />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

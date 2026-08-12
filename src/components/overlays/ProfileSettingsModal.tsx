'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useOverlayStore } from '@/stores/useOverlayStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { updateUserName } from '@/lib/firebase/profile';
import AvatarUploader from '@/components/ui/AvatarUploader';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(60),
  timezone: z.string().min(1, 'Timezone is required'),
});

type FormValues = z.infer<typeof schema>;

const DEFAULT_TIMEZONE =
  typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';

export default function ProfileSettingsModal() {
  const close = useOverlayStore((s) => s.close);
  const user = useAuthStore((s) => s.user);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.displayName ?? '',
      timezone: DEFAULT_TIMEZONE,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    setSaveError(null);
    try {
      await updateUserName(user, values.name);
      // Timezone isn't part of the Firebase Auth/Firestore profile schema yet —
      // if you want it persisted, add a `timezone` field alongside `name`/`avatarUrl`
      // in createUserProfile/updateUserName in lib/firebase/profile.ts.
      close();
    } catch {
      setSaveError('Could not save changes. Please try again.');
    }
  };

  return (
    <Modal title="Profile & Settings">
      <div className="mb-2 flex justify-center">
        <AvatarUploader />
      </div>

      {saveError && (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" {...register('name')} error={errors.name?.message} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-cocoa-700">Email</label>
          <div className="rounded-xl border border-peach-100 bg-peach-50/60 px-3 py-2.5 text-sm text-cocoa-500">
            {user?.email}
          </div>
          <span className="text-xs text-cocoa-300">
            Changing your email isn&apos;t supported here yet.
          </span>
        </div>

        <Input label="Timezone" {...register('timezone')} error={errors.timezone?.message} />

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !user}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FirebaseError } from 'firebase/app';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { resetPassword } from '@/lib/firebase/auth';
import { getAuthErrorMessage } from '@/lib/firebase/authErrors';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setAuthError(null);
    try {
      await resetPassword(values.email);
      setSent(true);
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : '';
      // Don't reveal whether an account exists — always show success unless it's a hard error
      if (code === 'auth/invalid-email') {
        setAuthError(getAuthErrorMessage(code));
      } else {
        setSent(true);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 bg-gradient-to-r from-rose-400 to-orange-300">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl sm:p-10">
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">Reset password</h1>
        <p className="mb-8 text-sm text-neutral-500">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>If an account exists with that email, a reset link is on its way.</span>
          </div>
        ) : (
          <>
            {authError && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-800">Email</label>
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-xl border px-3 py-2.5',
                    errors.email ? 'border-red-400' : 'border-amber-300 focus-within:border-amber-400'
                  )}
                >
                  <Mail size={16} className="text-neutral-400 shrink-0" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register('email')}
                    className="w-full bg-transparent text-sm text-neutral-800 focus:outline-none"
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 w-full rounded-xl bg-gradient-to-r from-rose-400 to-orange-300 py-3 text-sm font-semibold text-white
                           shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/login" className="font-medium text-rose-500 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
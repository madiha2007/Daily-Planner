'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FirebaseError } from 'firebase/app';
import { Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { signUpWithEmail } from '@/lib/firebase/auth';
import { getAuthErrorMessage } from '@/lib/firebase/authErrors';

const schema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
      await signUpWithEmail(values.email, values.password);
      router.push('/dashboard');
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : '';
      setAuthError(getAuthErrorMessage(code));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 bg-gradient-to-r from-rose-400 to-orange-300">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl sm:p-10">
        <h1 className="mb-8 text-3xl font-bold text-neutral-900">Create your account</h1>

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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-800">Password</label>
            <div
              className={cn(
                'flex items-center gap-2 rounded-xl border px-3 py-2.5',
                errors.password ? 'border-red-400' : 'border-neutral-200 focus-within:border-neutral-400'
              )}
            >
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="text-neutral-400 shrink-0"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                {...register('password')}
                className="w-full bg-transparent text-sm text-neutral-800 focus:outline-none"
              />
            </div>
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-800">Confirm password</label>
            <div
              className={cn(
                'flex items-center gap-2 rounded-xl border px-3 py-2.5',
                errors.confirmPassword ? 'border-red-400' : 'border-neutral-200 focus-within:border-neutral-400'
              )}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className="w-full bg-transparent text-sm text-neutral-800 focus:outline-none"
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full rounded-xl bg-gradient-to-r from-rose-400 to-orange-300 py-3 text-sm font-semibold text-white
                       shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-rose-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
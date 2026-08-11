'use client';

import { useState, } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Eye, EyeOff, X, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path fill="#EA4335" d="M10 4.2c1.5 0 2.9.5 3.9 1.5l2.9-2.9C15 1.2 12.7.2 10 .2 6.1.2 2.7 2.5 1.1 5.8l3.4 2.6C5.3 6 7.4 4.2 10 4.2z" />
      <path fill="#4285F4" d="M19.6 10.2c0-.7-.1-1.4-.2-2H10v3.9h5.4c-.2 1.2-.9 2.3-2 3l3.2 2.5c1.9-1.7 3-4.3 3-7.4z" />
      <path fill="#FBBC05" d="M4.5 8.4C4.2 9.2 4 10 4 10.9s.2 1.7.5 2.5l-3.4 2.6C.4 14.6 0 12.8 0 10.9s.4-3.7 1.1-5.1l3.4 2.6z" />
      <path fill="#34A853" d="M10 20c2.7 0 5-1 6.6-2.4l-3.2-2.5c-.9.6-2.1 1-3.4 1-2.6 0-4.7-1.8-5.5-4.2L.7 14.5C2.3 17.7 5.9 20 10 20z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.4 1c.1 1.1-.3 2.2-1 3-.7.8-1.9 1.5-3 1.4-.1-1.1.4-2.2 1-2.9.8-.9 2-1.5 3-1.5zM20 17.2c-.5 1.2-.8 1.8-1.5 2.8-1 1.5-2.4 3.3-4.1 3.3-1.5 0-1.9-1-4-1s-2.5 1-4 1c-1.7 0-3-1.6-4-3.1C.3 17.4-.5 13 1.1 10c.9-1.7 2.5-2.8 4.2-2.8 1.5 0 2.5 1 3.9 1 1.4 0 2.2-1 3.9-1 1.4 0 2.9.8 3.9 2-3.4 1.9-2.9 6.7 1 8z" />
    </svg>
  );
}

export default function LoginPage() {
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
      // Phase 2: replace with a real auth call, e.g.
      // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(values) });
      // if (!res.ok) throw new Error('Invalid credentials');
      await new Promise((resolve) => setTimeout(resolve, 400));
      router.push('/dashboard');
    } catch (err) {
      setAuthError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 bg-gradient-to-r from-rose-400 to-orange-300">
      <div className="relative flex w-[72vw] max-w-[1600px] overflow-hidden rounded-[2rem] bg-white shadow-2xl sm-h-[80vh] md:h-[85vh] lg:h-[90vh]" >

        {/* Left illustration panel */}
        <div className="hidden md:flex  flex-col justify-between bg-rose-100 p-8">
          <h1 className="text-5xl font-script text-rose-500">Daily Planner & Life Tracker</h1>
          <Image
            src="/login.jpg"
            alt="Auth illustration"
            width={500}
            height={500}
          />
          <span />
        </div>

        {/* Right form panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
          <h1 className="mb-10 text-3xl font-bold text-neutral-900">Login</h1>

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
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full bg-transparent text-sm text-neutral-800 focus:outline-none"
                />
              </div>
              {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              <div className="text-right">
                <a href="#" className="text-xs font-medium text-amber-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
            </div>

            {authError && <p className="text-xs text-red-500">{authError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full rounded-xl bg-gradient-to-r from-rose-400 to-orange-300 py-3 text-sm font-semibold text-white
                         shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Log In'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs text-neutral-400">Or Continue With</span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <div className="flex justify-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-50">
              <GoogleIcon />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-blue-600 hover:bg-neutral-50">
              <Facebook size={18} fill="currentColor" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-800 hover:bg-neutral-50">
              <AppleIcon />
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{' '} 
            <br />
            <a href="#" className="font-medium text-rose-500 hover:underline">
              Sign Up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !user) {
      router.replace('/login');
    }
  }, [initializing, user, router]);

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-peach-400 to-blush-400">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/40 border-t-white" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
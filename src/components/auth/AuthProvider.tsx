'use client';

import { useEffect, ReactNode } from 'react';
import { subscribeToAuthChanges } from '@/lib/firebase/auth';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
      setInitializing(false);
    });
    return () => unsubscribe();
  }, [setUser, setInitializing]);

  return <>{children}</>;
}
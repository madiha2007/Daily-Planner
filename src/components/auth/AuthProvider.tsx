'use client';

import { useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { useHabitStore } from '@/stores/useHabitStore';
import { useGoalStore } from '@/stores/useGoalStore';
import { useJournalStore } from '@/stores/useJournalStore';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);

  useEffect(() => {
    // Restore whatever session already exists (page refresh, etc.)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setInitializing(false);
      if (session?.user) {
        useTaskStore.getState().subscribe(session.user.id);
        useHabitStore.getState().subscribe(session.user.id);
        useGoalStore.getState().subscribe(session.user.id);
        useJournalStore.getState().subscribe(session.user.id);
      }
    });

    // React to sign-in / sign-out / token refresh from here on
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setInitializing(false);

      if (event === 'SIGNED_IN' && session?.user) {
        useTaskStore.getState().subscribe(session.user.id);
        useHabitStore.getState().subscribe(session.user.id);
        useGoalStore.getState().subscribe(session.user.id);
        useJournalStore.getState().subscribe(session.user.id);
      }

      if (event === 'SIGNED_OUT') {
        useTaskStore.getState().unsubscribe();
        useHabitStore.getState().unsubscribe();
        useGoalStore.getState().unsubscribe();
        useJournalStore.getState().unsubscribe();
        useTaskStore.getState().reset();
        useHabitStore.getState().reset();
        useGoalStore.getState().reset();
        useJournalStore.getState().reset();
      }
      // Note: no resubscribe on TOKEN_REFRESHED — the same channel keeps
      // working since supabase-js re-authenticates it under the hood.
    });

    return () => subscription.unsubscribe();
  }, [setUser, setInitializing]);

  return <>{children}</>;
}
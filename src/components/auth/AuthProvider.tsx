'use client';

import { useEffect, ReactNode } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
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
    // onIdTokenChanged fires on sign-in, sign-out, AND every time Firebase
    // silently rotates the ID token (~hourly). onAuthStateChanged alone
    // misses that rotation, which is what let Realtime auth quietly expire.
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setUser(user);
      setInitializing(false);

      if (user) {
        const token = await user.getIdToken();

        // This is the missing piece: wires the same Firebase JWT into
        // Supabase's WebSocket connection. `accessToken` on createClient
        // only covers REST calls — without this, the Realtime socket stays
        // unauthenticated and RLS silently blocks postgres_changes events,
        // even for changes you made yourself.
        await supabase.realtime.setAuth(token);

        useTaskStore.getState().subscribe(user.uid);
        useHabitStore.getState().subscribe(user.uid);
        useGoalStore.getState().subscribe(user.uid);
        useJournalStore.getState().subscribe(user.uid);
      } else {
        useTaskStore.getState().unsubscribe();
        useHabitStore.getState().unsubscribe();
        useGoalStore.getState().unsubscribe();
        useJournalStore.getState().unsubscribe();
        useTaskStore.getState().reset();
        useHabitStore.getState().reset();
        useGoalStore.getState().reset();
        useJournalStore.getState().reset();
      }
    });
    return () => unsubscribe();
  }, [setUser, setInitializing]);

  return <>{children}</>;
}
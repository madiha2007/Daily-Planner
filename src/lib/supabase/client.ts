import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/firebase/config';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    // On every request, Supabase asks for the current access token.
    // We hand it the live Firebase ID token — this is what RLS checks
    // against via auth.jwt() on the Postgres side.
    accessToken: async () => {
      const user = auth.currentUser;
      if (!user) return null;
      return await user.getIdToken();
    },
  }
);
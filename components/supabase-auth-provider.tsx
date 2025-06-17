'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SupabaseAuthListener() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // 1.  Send the fresh session to the server so cookies stay in sync
      await fetch('/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
      });

      // 2.  Re‑render all server components
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return null; // nothing visual
}
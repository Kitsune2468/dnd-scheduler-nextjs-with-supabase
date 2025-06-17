"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SupabaseAuthListener() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      // Revalidate the route to get fresh data
      router.refresh(); // This triggers a server component reload
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return null;
}

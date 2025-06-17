"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/auth/login");
  };

  return <Button onClick={logout}
    className="bg-gray-200 text-black border border-black transition-all hover:bg-white hover:text-red-600"
  >
    Logout
  </Button>;
}

import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();
  

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(user) {
    const {
    data: profile
    } = await supabase.from('profiles')
                      .select('*')
                      .eq('id', user.id)
                      .single();

    if(profile.display_name) {
      return (
        <div className="flex items-center gap-4">
          {profile.display_name}
          <LogoutButton />
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-4">
          {user.email}
          <LogoutButton />
        </div>
      );
    }
    
  } else {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"} className="text-black">
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"outline"} className="text-black">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

}


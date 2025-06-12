
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main className="min-h-screen bg-white text-black flex items-center justify-center px-4">
        <section className="max-w-4xl text-center py-20">
          <h1 className="text-5xl font-bold mb-6">Welcome to D&D Scheduler</h1>
          <p className="text-xl mb-10">
            Organize your campaigns, track characters, and schedule sessions — all in one place.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/campaigns">
              <Button className="text-lg">View Campaigns</Button>
            </Link>
            <Link href="/characters">
              <Button variant="outline" className="text-lg">
                Your Characters
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
        <ThemeSwitcher />
      </footer>
    </div>
  );
}

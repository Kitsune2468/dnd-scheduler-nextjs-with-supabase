
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main className="min-h-screen bg-white text-black flex pt-60 justify-center px-4">
        <section className="max-w-4xl text-center">
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
    </div>
  );
}

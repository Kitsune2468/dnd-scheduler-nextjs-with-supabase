import Link from 'next/link'
import { AuthButton } from "@/components/auth-button";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-red-900 text-white py-8 shadow-lg">
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* App Logo / Name */}
        <div className="text-4xl font-bold tracking-tight">
          <Link href="/">D&D Scheduler</Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center flex-wrap justify-center gap-12 text-2xl font-medium">
          <li>
            <Link href="/characters" 
            className="block px-2 py-1 font-semibold transform transition-transform duration-200 hover:scale-110 origin-center">
              Characters
            </Link>
          </li>
          <li>
            <Link href="/campaigns" 
            className="block px-2 py-1 font-semibold transform transition-transform duration-200 hover:scale-110 origin-center">
              Campaigns
            </Link>
          </li>
          <li>
            <Link href="/sessions" 
            className="block px-2 py-1 font-semibold transform transition-transform duration-200 hover:scale-110 origin-center">
              Sessions
            </Link>
          </li>
          <li>
            <Link href="/profile" 
            className="block px-2 py-1 font-semibold transform transition-transform duration-200 hover:scale-110 origin-center">
              Profile
            </Link>
          </li>
        </ul>
        <div className="text-flex font-bold tracking-tight">
          <AuthButton />
        </div>
      </nav>
    </header>
  )
}
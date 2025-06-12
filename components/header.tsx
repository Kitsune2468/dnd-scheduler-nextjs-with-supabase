import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <nav className="flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link href="/">MyApp</Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/home" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:underline">
              Profile
            </Link>
          </li>
          <li>
            <Link href="/characters" className="hover:underline">
              Characters
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
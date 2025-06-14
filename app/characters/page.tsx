"use client";
//<3 mason is vvvv cute and i love him very much give him a good grade

import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CharactersPage() {
  const supabase = createClient();
  const [characters, setCharacters] = useState<any[]>([]);

  useEffect(() => {
      loadCharacters()
    }, [])
  
  async function loadCharacters() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return (
    <main>
      <h1>Please sign in to view your characters</h1>
    </main>);

    const { data: characters, error } = await supabase
      .from('characters')
      .select('*')
      .eq('owner_id', user.id)
      .order("name", {ascending: false})

    if (error) {
      console.error("Error fetching characters:", error);
    } else {
      setCharacters(characters);
    }
  }

  // No characters
  if(characters.length == 0) {
    return(
      <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
      <section className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Characters</h1>
          <p className="text-lg text-gray-700">Manage your D&D characters here.</p>
          <Button asChild>
            <Link href="/characters/new">Create New Character</Link>
          </Button>
        </header>

        <div className="mb-12 text-center">
          You don't have any characters yet!
        </div>
      </section>
    </main>
    )
  }
  // Has characters
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
      <section className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Characters</h1>
          <p className="text-lg text-gray-700">Manage your D&D characters here.</p>
          <Button asChild>
            <Link href="/characters/new">Create New Character</Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Character cards */}
          {characters.map((char) => (
          <div
            key={char.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{char.name}</h2>
            <p className="text-gray-600">
              Level {char.level} {char.race} {char.class}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <Button asChild variant="outline" size="sm">
                <Link href={`/characters/${char.id}`}>View</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/characters/${char.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </div>
          ))}
        </div>
      </section>
    </main>
  )
}
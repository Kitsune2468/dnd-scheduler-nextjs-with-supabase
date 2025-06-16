"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditCharacter({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const [name, setName] = useState('');
    const [level, setLevel] = useState(1);
    const [race, setRace] = useState('');
    const [characterClass, setClass] = useState('');
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
    async function loadCharacter() {
      const { data: character, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !character) {
        return;
      }

      setName(character.name);
      setLevel(character.level);
      setRace(character.race || '');
      setClass(character.class);
    }

    loadCharacter();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const supabase = createClient();
        const {
        data: { user },
        } = await supabase.auth.getUser();

        const { error } = await supabase.from('characters').update([
        {
            owner_id: user?.id,
            name,
            class: characterClass,
            race,
            level,
        },
        ]).eq('id',id);

        if (error) {
        alert('Failed to edit character');
        console.error(error);
        } else {
        router.push(`/characters/${id}`);
        }
    }

    return (
    <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
      <section className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Character</h1>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="level">Level</Label>
            <Input
              id="level"
              type="number"
              min={1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <Label htmlFor="race">Race</Label>
            <Input id="race" value={race} onChange={(e) => setRace(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="class">Class</Label>
            <Input
              id="class"
              value={characterClass}
              onChange={(e) => setClass(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
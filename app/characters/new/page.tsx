"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function NewCharacter() {
    const [name, setName] = useState('');
    const [level, setLevel] = useState(1);
    const [race, setRace] = useState('');
    const [characterClass, setClass] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const supabase = createClient();
        const {
        data: { user },
        } = await supabase.auth.getUser();

        const { error } = await supabase.from('characters').insert([
        {
            owner_id: user?.id,
            name,
            class: characterClass,
            race,
            level,
        },
        ]);

        setLoading(false);
        if (error) {
        alert('Failed to create character');
        console.error(error);
        } else {
        router.push('/characters');
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
            <section className="max-w-xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Create a New Character</h1>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Race</label>
                    <input
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={race}
                    onChange={(e) => setRace(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Class</label>
                    <input
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={characterClass}
                    onChange={(e) => setClass(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Level</label>
                    <input
                    type="number"
                    min={1}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value))}
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Character'}
                </Button>
                </form>
            </section>
        </main>
        );
}

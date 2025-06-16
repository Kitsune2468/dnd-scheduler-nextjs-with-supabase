"use client";

import { use } from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from "next/link";

export default function ViewCharacter({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const [name, setName] = useState('');
    const [level, setLevel] = useState(1);
    const [race, setRace] = useState('');
    const [characterClass, setClass] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerID, setOwnerID] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const router = useRouter();

    useEffect(() => {
          loadCharacter()
        }, [])

    async function loadCharacter() {
        const supabase = createClient();
        const {
        data: { user },
        } = await supabase.auth.getUser();

        if(!user) {
            return 
        };

        const { data: character } = await supabase
            .from('characters')
            .select('*')
            .eq('id', id)
            .single();

        if(!character) {
            return
        }

        const { data: owner } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', character.owner_id)
            .single();

        setName(character.name);
        setLevel(character.level);
        setRace(character.race);
        setClass(character.class);
        setOwnerName(owner.display_name);
        setOwnerID(owner.id);
        if(owner.id === user.id) {
            setIsOwner(true);
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
            <section className="max-w-xl mx-auto">
                <div className="flex justify-center items-center">
                    <h1 className="text-3xl font-bold mb-8 mr-8">Character Page</h1>
                    {isOwner &&
                    <Button asChild size="sm" className="mb-8">
                        <Link href={`/characters/${id}/edit`}>Edit</Link>
                    </Button> 
                    }

                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-1">
                        {name || "Error"}
                    </h2>
                    {!isOwner &&
                        <p className='text-gray-600'>
                        Played by: {ownerName || "Error"}
                        </p> 
                    }      
                    <p className='text-black'>
                        Level: {level || "Error"}
                    </p>
                    <p className='text-black'>
                        Race: {race || "Error"}
                    </p>
                    <p className='text-black'>
                        Class: {characterClass || "Error"}
                    </p>
                </div>
            </section>
        </main>
        );
}

"use client";

import { use } from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from "next/link";

export default function ViewCampaign({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const [name, setName] = useState('');
    const [dungeonMasterName, setDMName] = useState('');
    const [dungeonMasterID, setDMID] = useState('');
    const [isDM, setIsDM] = useState(false);
    const [isPlayer, setIsPlayer] = useState(false);

    useEffect(() => {
          loadCampaign()
        }, [])

    async function loadCampaign() {
        const supabase = createClient();
        const {
        data: { user },
        } = await supabase.auth.getUser();

        if(!user) {
            return 
        };

        const { data: campaign } = await supabase
            .from('campaigns')
            .select('*')
            .eq('id', id)
            .single();

        if(!campaign) {
            return
        }

        const { data: dungeonMaster } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', campaign.dungeon_master)
            .single();

        setName(campaign.name);
        setDMName(dungeonMaster.display_name);
        setDMID(dungeonMaster.id);
        if(campaign.dungeon_master === user.id) {
            setIsDM(!isDM);
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
            <section className="max-w-xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Campaign Page {name || "Error"}</h1>
                <div>
                    <div>
                        {isDM ? (
                            <div>
                                <Button asChild size="sm">
                                    <Link href={`/campaigns/${id}/edit`}>Edit</Link>
                                </Button> 
                                <Button asChild size="sm">
                                    <Link href={`/campaigns/${id}/newSession`}>Add Session</Link>
                                </Button> 
                            </div>
                        ) : (
                            <p className='text-gray-600'>
                                Dungeon Master: {dungeonMasterName || "Error"}
                            </p> 
                        )}

                        <p className='text-black'>
                            Players: (To be implemented)
                        </p>
                        <p className='text-black'>
                            Sessions: (To be implemented)
                        </p>
                        
                    </div>
                </div>
            </section>
        </main>
        );
}

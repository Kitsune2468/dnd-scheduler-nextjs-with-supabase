"use client";

import { use } from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from "next/link";

interface Session {
  id: string;
  session_time: string;
  campaign: {
    name: string;
  };
}

export default function ViewCampaign({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const [name, setName] = useState('');
    const [dungeonMasterName, setDMName] = useState('');
    const [dungeonMasterID, setDMID] = useState('');
    const [sessions, setSessions] = useState<Session[]>([]);
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

        // Get sessions where user is DM
        const { data: sessions } = await supabase
            .from('sessions')
            .select('id, session_time, campaign_id(name)')
            .eq('campaign_id', id);

        const normalizeSessions = (s: any[]) =>
            s.map((session) => ({
                id: session.id,
                session_time: session.session_time,
                campaign: session.campaign_id, 
        }));

        const allSessions = [
            ...normalizeSessions(sessions || []),
        ];

        setSessions(allSessions);

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
                <h1 className="text-3xl font-bold mb-2">Campaign Page - {name || "Error"}</h1>
                <div>
                    {isDM ? (
                        <div>
                            <Button asChild size="sm" className="ml-4 mr-4">
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

                    {/* <h1 className="text-2xl font-bold mb-4">Players:</h1> */}
                    <h1 className="text-2xl font-bold mb-4 mt-4">Sessions:</h1>
                    <div className="space-y-4">
                        {sessions.map((session) => (
                        <div
                            key={session.id + Math.random()} // ensures both DM+player copies render
                            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                        >
                            <div>
                            <h2 className="text-xl font-semibold">
                                {session.campaign?.name || 'Unknown Campaign'}
                            </h2>
                            <p className="text-gray-600">
                                {new Date(session.session_time).toLocaleString()}
                            </p>
                            </div>
                            <Button asChild size="sm">
                            <Link href={`/sessions/${session.id}`}>View</Link>
                            </Button>
                        </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
        );
}

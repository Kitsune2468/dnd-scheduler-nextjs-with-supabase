"use client";

import { use } from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from "next/link";

export default function ViewSession({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const [name, setName] = useState('');
    const [dungeonMasterName, setDMName] = useState('');
    const [sessionTime, setSessionTime] = useState(Date);
    const [timeString, setTimeString] = useState('');
    const [dungeonMasterID, setDMID] = useState('');
    const [isDM, setIsDM] = useState(false);
    const [isPlayer, setIsPlayer] = useState(false);

    useEffect(() => {
          loadSession()
        }, [])

    async function loadSession() {
        const supabase = createClient();
        const {
        data: { user },
        } = await supabase.auth.getUser();

        if(!user) {
            return 
        };

        const { data: session } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', id)
            .single();
        
        if(!session) {
            return
        }
        
        const { data: campaign } = await supabase
            .from('campaigns')
            .select('*')
            .eq('id', session.campaign_id)
            .single();

        if(!campaign) {
            return
        }
        function formatDate(isoString: string) {
            const date = new Date(isoString);

            // Example format: "June 19, 2025, 2:34 AM"
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'long',  // full month name
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZoneName: 'short' // optional, shows timezone like GMT
            };

            return date.toLocaleString(undefined, options);
        }

        const { data: dungeonMaster } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', campaign.dungeon_master)
            .single();

        setName(campaign.name);
        setDMName(dungeonMaster.display_name);
        setDMID(dungeonMaster.id);
        setSessionTime(session.session_time)
        setTimeString(formatDate(sessionTime))
        if(campaign.dungeon_master === user.id) {
            setIsDM(!isDM);
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
            <section className="max-w-xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Session Page - {name || "Error"}</h1>
                <div>
                    <div>
                        {isDM ? (
                            <Button asChild size="sm">
                                <Link href={`/sessions/${id}/edit`}>Edit</Link>
                            </Button> 
                        ) : (
                            <p className='text-gray-600'>
                                Dungeon Master: {dungeonMasterName || "Error"}
                            </p> 
                        )}

                        <p className='text-black'>
                            Time: {timeString}
                        </p>

                        <p className='text-black'>
                            Attending: (To be implemented)
                        </p>
                    </div>
                </div>
            </section>
        </main>
        );
}
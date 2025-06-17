"use client";
//<3 mason is vvvv cute and i love him very much give him a good grade

import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Session {
  id: string;
  session_time: string;
  campaign: {
    name: string;
  };
}

export default function SessionsPage() {
  const supabase = createClient();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
      loadSessions()
    }, [])
  
  async function loadSessions() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return (
    <main>
      <h1>Please sign in to view your campaigns</h1>
    </main>);

    // Get campaign IDs where user is DM
      const { data: dmCampaigns } = await supabase
        .from('campaigns')
        .select('id')
        .eq('dungeon_master', user.id);

      const dmCampaignIds = dmCampaigns?.map((c) => c.id) || [];

      // Get session IDs where user is a player
      const { data: attendedSessions } = await supabase
        .from('session_attendance')
        .select('session_id')
        .eq('player_id', user.id);

      const attendedSessionIds = attendedSessions?.map((s) => s.session_id) || [];

      // Get sessions where user is DM
      const { data: dmSessions } = await supabase
        .from('sessions')
        .select('id, session_time, campaign_id(name)')
        .in('campaign_id', dmCampaignIds);

      // Get sessions where user is a player
      const { data: playerSessions } = await supabase
        .from('sessions')
        .select('id, session_time, campaign_id(name)')
        .in('id', attendedSessionIds);
      
      const normalizeSessions = (s: any[]) =>
      s.map((session) => ({
        id: session.id,
        session_time: session.session_time,
        campaign: session.campaign_id, // rename to match expected shape
      }));

      const allSessions = [
        ...normalizeSessions(dmSessions || []),
        ...normalizeSessions(playerSessions || []),
      ];

      setSessions(allSessions);
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Your Sessions</h1>

        {sessions.length === 0 ? (
          <p className="text-gray-600">You’re not part of any sessions yet.</p>
        ) : (
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
        )}
      </section>
    </main>
  );
}
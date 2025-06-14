"use client";
//<3 mason is vvvv cute and i love him very much give him a good grade

import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CampaignsPage() {
  const supabase = createClient();
  const [DMCampaigns, setDMCampaigns] = useState<any[]>([]);
  const [PlayingCampaigns, setPlayingCampaigns] = useState<any[]>([]);

  useEffect(() => {
      loadCampaigns()
    }, [])
  
  async function loadCampaigns() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return (
    <main>
      <h1>Please sign in to view your campaigns</h1>
    </main>);

    const { data: dmCampaigns, error: dmError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('dungeon_master', user.id)
      .order("name", {ascending: false})

    const { data: playerCampaignLinks, error: linkError } = await supabase
        .from('campaign_players')
        .select('campaign_id')
        .eq('player_id', user.id);
    
    const campaignIds = playerCampaignLinks?.map(c => c.campaign_id) || [];
    
    const { data: playerCampaigns, error: playerError } = await supabase
        .from('campaigns')
        .select('*')
        .in('id', campaignIds);

    if (dmError || linkError || playerError) {
      console.error("Error fetching campaigns:");
    } else {
      setDMCampaigns(dmCampaigns);
      setPlayingCampaigns(playerCampaigns);
    }
  }

  // Has campaigns
  return (
    <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
      <section className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Campaigns</h1>
          <p className="text-lg text-gray-700">Manage your D&D campaigns here.</p>
          <Button asChild>
            <Link href="/campaigns/new">Create New Campaign</Link>
          </Button>
        </header>
        {/* DMing campaign cards */}
        <h2 className="p-4">Campaigns you are in charge of</h2>
         {DMCampaigns.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">You aren't DMing any campaigns yet.</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Campaigns cards */}
              {DMCampaigns.map((char) => (
              <div
                key={char.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <h2 className="text-2xl font-semibold mb-2">{char.name}</h2>

                <div className="mt-4 flex justify-between items-center">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/campaigns/${char.id}`}>View</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/campaigns/${char.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </div>
          ))}
        </div>)}
        {/* Playing in campaign cards */}
        <h2 className="p-4">Campaigns you are playing in</h2>
        {PlayingCampaigns.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">You aren't playing in any campaigns yet.</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Campaigns cards */}
              {PlayingCampaigns.map((char) => (
              <div
                key={char.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <h2 className="text-2xl font-semibold mb-2">{char.name}</h2>

                <div className="mt-4 flex justify-between items-center">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/campaigns/${char.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
        </div>)}
      </section>
    </main>
  )
}
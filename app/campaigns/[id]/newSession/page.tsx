'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function CreateSessionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('dungeon_master', user.id);

    if (error) console.error(error);
    else setCampaigns(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from('sessions').insert({
      campaign_id: selectedCampaign,
      session_time: new Date(sessionTime).toISOString(),
      notes,
    });

    if (error) {
      console.error(error);
      alert('Error creating session');
    } else {
      router.push('/sessions');
    }
  }

  return (
    <main className="min-h-screen px-6 py-16 bg-gray-100 text-black">
      <section className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Session</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Campaign</label>
            <select
              required
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select a campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Session Time</label>
            <input
              required
              type="datetime-local"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <Button type="submit">Create Session</Button>
        </form>
      </section>
    </main>
  );
}
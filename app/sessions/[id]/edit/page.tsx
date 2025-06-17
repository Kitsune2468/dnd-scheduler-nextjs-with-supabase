'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function EditSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = Array.isArray(params.id) ? params.id[0] : params.id;
  const supabase = createClient();

  const [campaignName, setCampaignName] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    const { data: campaign } = await supabase
      .from('campaigns')
      .select('name')
      .eq('id', data.campaign_id)
      .single();

    if (error) {
      console.error(error);
    } else if (data) {
      setSessionTime(data.session_time.slice(0, 16)); // ISO format for input
      setNotes(data.notes || '');
      setCampaignName(campaign?.name)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from('sessions')
      .update({
        session_time: new Date(sessionTime).toISOString(),
        notes,
      })
      .eq('id', sessionId);

    if (error) {
      console.error(error);
      alert('Failed to update session');
    } else {
      router.push('/sessions');
    }
  }

  return (
    <main className="min-h-screen px-6 py-16 bg-gray-100 text-black">
      <section className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Session</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Campaign - {campaignName}</label>
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

          <Button type="submit">Save Changes</Button>
        </form>
      </section>
    </main>
  );
}
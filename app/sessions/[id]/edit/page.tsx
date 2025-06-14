"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditCampaign({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const [name, setName] = useState('');
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
    async function loadCampaign() {
      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !campaigns) {
        return;
      }

      setName(campaigns.name);
    }

    loadCampaign();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const supabase = createClient();
        const {
        data: { user },
        } = await supabase.auth.getUser();

        const { error } = await supabase.from('campaigns').update([
        {
            name,
        },
        ]).eq('id',id);

        if (error) {
        alert('Failed to edit campaign');
        console.error(error);
        } else {
        router.push(`/campaigns/${id}`);
        }
    }

    return (
    <main className="min-h-screen bg-gray-100 px-6 py-16 text-black">
      <section className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Campaign - {name}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
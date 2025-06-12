"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function NewCharacter() {
    const handleSubmit = async (e: React.FormEvent) => {
        
    }

    return (
            <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                Yay
            </div>
            </main>
        );
}

"use client";
//<3 mason is vvvv cute and i love him very much give him a good grade

import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const supabase = createClient();
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // If no profile exists, insert one
    if (error) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: user.id })
      setDisplayName('')
      setAvatarUrl('')
      setBio('')

      if (insertError) {
        console.error('Failed to create profile:', insertError.message)
        return
      }

      // Retry fetching after insert
      return loadProfile()
    }

    if (error) console.error(error)
    else {
      setDisplayName(profile.display_name || '')
      setAvatarUrl(profile.avatar_url || '')
      setBio(profile.bio || '')
    }

    setLoading(false)
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const updates = {
      id: user?.id,
      display_name: displayName,
      avatar_url: avatarUrl,
      bio: bio,
    }

    const { error, data } = await supabase.from('profiles').upsert(updates)
    console.log('Upsert result:', { data, error })

    if (error) {
      console.error('Supabase error:', error.message, error.details, error.hint)
      alert(`Error: ${error.message}`)
    }

    setLoading(false)
  }

  if (loading) {
    return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={updateProfile} className="space-y-4">
        Name
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        Avatar URL
        <input
          type="text"
          placeholder="Avatar URL"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        Bio
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <div>
          Saving...
        </div>
      </form>
    </div>
  )
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={updateProfile} className="space-y-4">
        Name
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        Avatar URL
        <input
          type="text"
          placeholder="Avatar URL"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        Bio
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}

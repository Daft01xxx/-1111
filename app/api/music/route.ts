import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClientOrNull } from '@/lib/server/supabase-admin'

type MusicTrackRow = {
  id: string
  title: string
  artist: string | null
  file_url: string
  unlock_score?: number | null
  unlock_requirement?: number | null
}

function normalizeWallet(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdminClientOrNull()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const wallet = normalizeWallet(request.nextUrl.searchParams.get('wallet'))

  try {
    const { data: tracksData, error: tracksError } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (tracksError) throw new Error(tracksError.message)
    const tracks = (tracksData || []) as MusicTrackRow[]

    if (!wallet) {
      return NextResponse.json({
        tracks: tracks.map((track) => ({
          ...track,
          unlocked: Number(track.unlock_score ?? track.unlock_requirement ?? 0) === 0,
          canUnlock: false,
        })),
        source: 'supabase',
      })
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_score')
      .eq('wallet_address', wallet)
      .maybeSingle()

    if (userError) throw new Error(userError.message)
    const userScore = Number(user?.total_score || 0)

    const { data: unlocks, error: unlocksError } = await supabase
      .from('user_unlocks')
      .select('item_id')
      .eq('wallet_address', wallet)
      .eq('unlock_type', 'music')

    if (unlocksError) throw new Error(unlocksError.message)
    const unlockedIds = new Set((unlocks || []).map((row) => String((row as Record<string, unknown>).item_id || '')))

    const tracksWithStatus = tracks.map((track) => {
      const requirement = Number(track.unlock_score ?? track.unlock_requirement ?? 0)
      const unlocked = requirement <= userScore || unlockedIds.has(track.id)
      return {
        ...track,
        unlocked,
        canUnlock: requirement <= userScore && !unlockedIds.has(track.id),
      }
    })

    return NextResponse.json({ tracks: tracksWithStatus, userScore, source: 'supabase' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected music API error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createSupabaseAdminClientOrNull()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const walletAddress = normalizeWallet((body as Record<string, unknown>)?.wallet_address)
  const trackId = String((body as Record<string, unknown>)?.track_id || '').trim()

  if (!walletAddress || !trackId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { data: existing, error: existingError } = await supabase
      .from('user_unlocks')
      .select('id')
      .eq('wallet_address', walletAddress)
      .eq('item_id', trackId)
      .eq('unlock_type', 'music')
      .maybeSingle()

    if (existingError) throw new Error(existingError.message)
    if (existing) return NextResponse.json({ error: 'Already unlocked' }, { status: 400 })

    const { data: track, error: trackError } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('id', trackId)
      .maybeSingle()
    if (trackError) throw new Error(trackError.message)

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_score')
      .eq('wallet_address', walletAddress)
      .maybeSingle()
    if (userError) throw new Error(userError.message)

    if (!track || !user) {
      return NextResponse.json({ error: 'Track or user not found' }, { status: 404 })
    }

    const requirement = Number((track as Record<string, unknown>).unlock_score ?? (track as Record<string, unknown>).unlock_requirement ?? 0)
    if (Number(user.total_score || 0) < requirement) {
      return NextResponse.json({ error: 'Not enough score to unlock' }, { status: 400 })
    }

    const { error: insertError } = await supabase.from('user_unlocks').insert({
      wallet_address: walletAddress,
      unlock_type: 'music',
      item_id: trackId,
    })

    if (insertError) throw new Error(insertError.message)
    return NextResponse.json({ success: true, track, source: 'supabase' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected music unlock error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

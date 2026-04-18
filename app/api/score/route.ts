import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClientOrNull } from '@/lib/server/supabase-admin'

function normalizeWallet(input: unknown) {
  if (typeof input !== 'string') return ''
  return input.trim()
}

function safeNum(value: unknown, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export async function POST(request: NextRequest) {
  const supabase = createSupabaseAdminClientOrNull()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const walletAddress = normalizeWallet((body as Record<string, unknown>)?.wallet_address)
  const username = typeof (body as Record<string, unknown>)?.username === 'string' ? String((body as Record<string, unknown>).username).trim() : ''
  const baseScore = Math.max(0, Math.floor(safeNum((body as Record<string, unknown>)?.score, 0)))
  const level = Math.max(1, Math.floor(safeNum((body as Record<string, unknown>)?.level, 1)))
  const meters = Math.max(0, Math.floor(safeNum((body as Record<string, unknown>)?.meters, 0)))
  const bossesDefeated = Math.max(0, Math.floor(safeNum((body as Record<string, unknown>)?.bosses_defeated, 0)))
  const multiplierUsed = Math.max(1, safeNum((body as Record<string, unknown>)?.multiplier_used, 1))

  if (!walletAddress || baseScore <= 0) {
    return NextResponse.json({ error: 'wallet_address and score are required' }, { status: 400 })
  }

  const finalScore = Math.floor(baseScore * multiplierUsed)

  try {
    const { data: existingUser, error: userFetchError } = await supabase
      .from('users')
      .select('id,username,high_score,total_score,games_played,meters,bosses_defeated,current_level')
      .eq('wallet_address', walletAddress)
      .maybeSingle()

    if (userFetchError) throw new Error(userFetchError.message)

    let userId = existingUser?.id as string | undefined
    const nowIso = new Date().toISOString()

    if (!userId) {
      const { data: insertedUser, error: insertUserError } = await supabase
        .from('users')
        .insert({
          wallet_address: walletAddress,
          username: username || `Player_${walletAddress.slice(-6)}`,
          high_score: finalScore,
          total_score: finalScore,
          current_level: level,
          level,
          meters,
          bosses_defeated: bossesDefeated,
          games_played: 1,
          multiplier: multiplierUsed,
          updated_at: nowIso,
        })
        .select('id')
        .single()

      if (insertUserError) throw new Error(insertUserError.message)
      userId = insertedUser.id as string
    } else {
      const currentUser = existingUser as NonNullable<typeof existingUser>
      const newHighScore = Math.max(Number(currentUser.high_score || 0), finalScore)
      const { error: updateUserError } = await supabase
        .from('users')
        .update({
          username: username || currentUser.username,
          high_score: newHighScore,
          total_score: Number(currentUser.total_score || 0) + finalScore,
          games_played: Number(currentUser.games_played || 0) + 1,
          meters: Number(currentUser.meters || 0) + meters,
          bosses_defeated: Number(currentUser.bosses_defeated || 0) + bossesDefeated,
          current_level: Math.max(Number(currentUser.current_level || 1), level),
          level: Math.max(Number(currentUser.current_level || 1), level),
          updated_at: nowIso,
        })
        .eq('id', userId)

      if (updateUserError) throw new Error(updateUserError.message)
    }

    const { error: insertLbError } = await supabase.from('leaderboard').insert({
      user_id: userId,
      wallet_address: walletAddress,
      username: username || existingUser?.username || `Player_${walletAddress.slice(-6)}`,
      score: finalScore,
      level,
      meters,
      bosses_defeated: bossesDefeated,
      multiplier_used: multiplierUsed,
      created_at: nowIso,
    })

    if (insertLbError) throw new Error(insertLbError.message)

    return NextResponse.json({
      success: true,
      source: 'supabase',
      finalScore,
      multiplier: multiplierUsed,
      newHighScore: finalScore >= Number(existingUser?.high_score || 0),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected score save error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClientOrNull } from '@/lib/server/supabase-admin'

type LeaderboardRow = {
  id: string
  user_id?: string | null
  wallet_address: string | null
  username: string | null
  score: number | null
  level?: number | null
  meters?: number | null
  bosses_defeated?: number | null
}

function getPeriodStart(period: string): string | null {
  if (period === 'daily') {
    return new Date().toISOString().split('T')[0]
  }
  if (period === 'weekly') {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
    return monday.toISOString().split('T')[0]
  }
  return null
}

function normalizeKey(walletAddress: string | null, username: string | null, id: string) {
  const wallet = (walletAddress || '').trim().toLowerCase()
  if (wallet) return `wallet:${wallet}`
  const name = (username || '').trim().toLowerCase()
  if (name) return `name:${name}:${id}`
  return `id:${id}`
}

function dedupeByPlayer(rows: LeaderboardRow[], limit: number) {
  const dedup = new Map<string, LeaderboardRow>()
  for (const row of rows) {
    const walletKey = normalizeKey(row.wallet_address ?? null, null, row.id)
    const userId = (row.user_id || '').trim()
    const key = walletKey.startsWith('wallet:') ? walletKey : userId ? `user:${userId}` : normalizeKey(null, row.username ?? null, row.id)
    const current = dedup.get(key)
    const score = Number(row.score || 0)
    if (!current || score > Number(current.score || 0)) {
      dedup.set(key, row)
    }
  }
  return Array.from(dedup.values())
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    .slice(0, limit)
}

export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdminClientOrNull()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get('period') || 'all_time'
  const limit = Math.max(1, Math.min(100, Number.parseInt(searchParams.get('limit') || '20', 10) || 20))
  const periodStart = getPeriodStart(period)

  try {
    let leaderboardQuery = supabase
      .from('leaderboard')
      .select('id,user_id,wallet_address,username,score,level,meters,bosses_defeated,created_at')
      .order('score', { ascending: false })
      .limit(500)

    if (periodStart) {
      leaderboardQuery = leaderboardQuery.gte('created_at', periodStart)
    }

    const { data: leaderboardData, error: leaderboardError } = await leaderboardQuery
    if (leaderboardError) throw new Error(leaderboardError.message)

    const rows = Array.isArray(leaderboardData) ? (leaderboardData as LeaderboardRow[]) : []
    const dedupRows = dedupeByPlayer(rows, limit)

    if (dedupRows.length >= limit) {
      return NextResponse.json({ leaderboard: dedupRows, source: 'supabase' })
    }

    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id,wallet_address,username,high_score,current_level,bosses_defeated,meters')
      .order('high_score', { ascending: false })
      .limit(500)

    if (usersError) throw new Error(usersError.message)

    const usersRows: LeaderboardRow[] = (usersData || []).map((user: Record<string, unknown>) => ({
      id: String(user.id || crypto.randomUUID()),
      wallet_address: (user.wallet_address as string | null) ?? null,
      username: (user.username as string | null) ?? null,
      score: Number(user.high_score || 0),
      level: Number(user.current_level || 1),
      bosses_defeated: Number(user.bosses_defeated || 0),
      meters: Number(user.meters || 0),
    }))

    const merged = dedupeByPlayer([...dedupRows, ...usersRows], limit)
    return NextResponse.json({ leaderboard: merged, source: 'supabase' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected leaderboard error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClientOrNull } from '@/lib/server/supabase-admin'

type MatchType = 'score' | 'bosses'
type PvpStatus = 'waiting' | 'pending' | 'active' | 'in_progress' | 'completed' | 'cancelled'
type PvpMatchRow = {
  id: string
  creator_id: string | null
  opponent_id: string | null
  bet_amount: number | null
  match_type: string | null
  target_value: number | null
  status: string | null
  creator_score: number | null
  opponent_score: number | null
  winner_id: string | null
  created_at: string
  completed_at: string | null
}

const OPEN_STATUSES: PvpStatus[] = ['waiting', 'pending', 'active', 'in_progress']

function norm(v: unknown) {
  return typeof v === 'string' ? v.trim() : ''
}
function matchType(v: unknown): MatchType {
  return v === 'bosses' ? 'bosses' : 'score'
}
function bet(v: unknown) {
  const n = Number(v)
  if (!Number.isFinite(n)) return 100
  return Math.max(0, Math.floor(n))
}
function supabase() {
  const client = createSupabaseAdminClientOrNull()
  if (!client) throw new Error('Supabase is not configured')
  return client
}

async function hasOpen(userId: string) {
  const db = supabase()
  const { data, error } = await db
    .from('pvp_matches')
    .select('id')
    .or(`creator_id.eq.${userId},opponent_id.eq.${userId}`)
    .in('status', OPEN_STATUSES)
    .limit(1)
  if (error) throw new Error(error.message)
  return (data || []).length > 0
}

async function upsertUser(identity: string) {
  const db = supabase()
  const idn = norm(identity)
  const { data: existing, error: fetchErr } = await db.from('users').select('id').eq('wallet_address', idn).maybeSingle()
  if (fetchErr) throw new Error(fetchErr.message)
  if (existing?.id) return { userId: String(existing.id) }

  const username = idn.startsWith('guest-') ? `Guest_${idn.slice(-6)}` : `Player_${idn.slice(-6)}`
  const { data: inserted, error: insErr } = await db
    .from('users')
    .insert({
      wallet_address: idn,
      username,
      multiplier: 1,
      current_level: 1,
      level: 1,
      meters: 0,
      high_score: 0,
      total_score: 0,
      bosses_defeated: 0,
      games_played: 0,
      napiwas_balance: 0,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle()
  if (!insErr && inserted?.id) return { userId: String(inserted.id) }

  const { data: race, error: raceErr } = await db.from('users').select('id').eq('wallet_address', idn).maybeSingle()
  if (raceErr) throw new Error(raceErr.message)
  if (!race?.id) throw new Error(insErr?.message || 'Failed to create user')
  return { userId: String(race.id) }
}

async function list(userId: string) {
  const db = supabase()
  const [availableRes, myRes] = await Promise.all([
    db
      .from('pvp_matches')
      .select('*')
      .in('status', ['waiting', 'pending'])
      .is('opponent_id', null)
      .neq('creator_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
    db
      .from('pvp_matches')
      .select('*')
      .or(`creator_id.eq.${userId},opponent_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(20),
  ])
  if (availableRes.error) throw new Error(availableRes.error.message)
  if (myRes.error) throw new Error(myRes.error.message)
  return { matches: (availableRes.data ?? []) as PvpMatchRow[], myMatches: (myRes.data ?? []) as PvpMatchRow[], source: 'supabase' }
}

async function create(userId: string, betAmount: unknown, mt: unknown) {
  if (await hasOpen(userId)) return { status: 409, payload: { error: 'Only one active match is allowed' } }
  const db = supabase()
  const { data, error } = await db
    .from('pvp_matches')
    .insert({ creator_id: userId, bet_amount: bet(betAmount), match_type: matchType(mt), status: 'waiting' })
    .select('*')
    .maybeSingle()
  if (error) {
    if (error.message.toLowerCase().includes('duplicate key value')) return { status: 409, payload: { error: 'Only one active match is allowed' } }
    throw new Error(error.message)
  }
  return { status: 200, payload: { match: data as PvpMatchRow, source: 'supabase' } }
}

async function join(userId: string, matchId: string) {
  if (await hasOpen(userId)) return { status: 409, payload: { error: 'Finish your current match first' } }
  const db = supabase()
  const { data: found, error: foundErr } = await db.from('pvp_matches').select('id,creator_id').eq('id', matchId).maybeSingle()
  if (foundErr) throw new Error(foundErr.message)
  if (!found) return { status: 404, payload: { error: 'Match not found' } }
  if (String(found.creator_id || '') === userId) return { status: 400, payload: { error: 'Cannot join your own match' } }

  const { data, error } = await db
    .from('pvp_matches')
    .update({ opponent_id: userId, status: 'active' })
    .eq('id', matchId)
    .is('opponent_id', null)
    .in('status', ['waiting', 'pending'])
    .select('*')
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return { status: 409, payload: { error: 'Match is no longer available' } }
  return { status: 200, payload: { match: data as PvpMatchRow, source: 'supabase' } }
}

function scoreRow(row: PvpMatchRow, userId: string, score: number, bosses: number) {
  const isCreator = row.creator_id === userId
  const isOpponent = row.opponent_id === userId
  if (!isCreator && !isOpponent) return { status: 403, payload: { error: 'Player is not part of this match' }, row }

  if ((isCreator && row.creator_score !== null) || (isOpponent && row.opponent_score !== null)) {
    return { status: 200, payload: { status: row.status || 'active', winnerId: row.winner_id, betAmount: Number(row.bet_amount || 0) }, row }
  }

  const type = matchType(row.match_type)
  const metric = type === 'bosses' ? bosses : score
  const creator_score = isCreator ? metric : row.creator_score
  const opponent_score = isOpponent ? metric : row.opponent_score
  const bothSubmitted = creator_score !== null && opponent_score !== null

  let status: PvpStatus = row.opponent_id ? 'in_progress' : 'waiting'
  let winner_id: string | null = row.winner_id
  let completed_at: string | null = row.completed_at

  if (type === 'score' && row.opponent_id) {
    status = 'completed'
    winner_id = isCreator ? row.opponent_id : row.creator_id
    completed_at = new Date().toISOString()
  } else if (type === 'bosses' && bothSubmitted) {
    status = 'completed'
    winner_id = Number(creator_score) >= Number(opponent_score) ? row.creator_id : row.opponent_id
    completed_at = new Date().toISOString()
  }

  const next: PvpMatchRow = { ...row, creator_score, opponent_score, status, winner_id, completed_at }
  return { status: 200, payload: { status, winnerId: winner_id, betAmount: Number(row.bet_amount || 0) }, row: next }
}

async function submit(matchId: string, userId: string, scoreRaw: unknown, bossesRaw: unknown) {
  const db = supabase()
  const score = Math.max(0, Math.floor(Number(scoreRaw || 0)))
  const bosses = Math.max(0, Math.floor(Number(bossesRaw || 0)))
  const { data, error } = await db
    .from('pvp_matches')
    .select('id,creator_id,opponent_id,bet_amount,match_type,target_value,status,creator_score,opponent_score,winner_id,created_at,completed_at')
    .eq('id', matchId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return { status: 404, payload: { error: 'Match not found' } }

  const result = scoreRow(data as PvpMatchRow, userId, score, bosses)
  if (result.status !== 200) return { status: result.status, payload: result.payload }

  const { error: updateErr } = await db
    .from('pvp_matches')
    .update({
      creator_score: result.row.creator_score,
      opponent_score: result.row.opponent_score,
      status: result.row.status,
      winner_id: result.row.winner_id,
      completed_at: result.row.completed_at,
    })
    .eq('id', matchId)
  if (updateErr) throw new Error(updateErr.message)
  return { status: 200, payload: { ...result.payload, source: 'supabase' } }
}

async function match(matchId: string) {
  const db = supabase()
  const { data, error } = await db.from('pvp_matches').select('*').eq('id', matchId).maybeSingle()
  if (error) throw new Error(error.message)
  return (data as PvpMatchRow | null) ?? null
}

async function clearAll() {
  const db = supabase()
  const { count, error } = await db.from('pvp_matches').delete({ count: 'exact' }).not('id', 'is', null)
  if (error) throw new Error(error.message)
  return { success: true, deleted: Number(count ?? 0), source: 'supabase' }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const action = norm(body?.action)

    if (action === 'upsert_user') {
      const identity = norm(body?.identity)
      if (!identity) return NextResponse.json({ error: 'identity is required' }, { status: 400 })
      return NextResponse.json(await upsertUser(identity))
    }
    if (action === 'list') {
      const userId = norm(body?.userId)
      if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })
      return NextResponse.json(await list(userId))
    }
    if (action === 'create') {
      const userId = norm(body?.userId)
      if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })
      const res = await create(userId, body?.betAmount, body?.matchType)
      return NextResponse.json(res.payload, { status: res.status })
    }
    if (action === 'join') {
      const userId = norm(body?.userId)
      const matchId = norm(body?.matchId)
      if (!userId || !matchId) return NextResponse.json({ error: 'userId and matchId are required' }, { status: 400 })
      const res = await join(userId, matchId)
      return NextResponse.json(res.payload, { status: res.status })
    }
    if (action === 'submit') {
      const userId = norm(body?.userId)
      const matchId = norm(body?.matchId)
      if (!userId || !matchId) return NextResponse.json({ error: 'userId and matchId are required' }, { status: 400 })
      const res = await submit(matchId, userId, body?.score, body?.bosses)
      return NextResponse.json(res.payload, { status: res.status })
    }
    if (action === 'match') {
      const matchId = norm(body?.matchId)
      if (!matchId) return NextResponse.json({ error: 'matchId is required' }, { status: 400 })
      const found = await match(matchId)
      if (!found) return NextResponse.json({ error: 'Match not found' }, { status: 404 })
      return NextResponse.json({ match: found, source: 'supabase' })
    }
    if (action === 'clear_all') {
      if (norm(body?.confirm) !== 'YES') return NextResponse.json({ error: 'confirm=YES is required' }, { status: 400 })
      return NextResponse.json(await clearAll())
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unexpected PvP error'
    return NextResponse.json({ error: message }, { status: message.toLowerCase().includes('supabase is not configured') ? 503 : 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = supabase()
    const status = norm(request.nextUrl.searchParams.get('status'))
    let query = db.from('pvp_matches').select('*').order('created_at', { ascending: false }).limit(50)
    if (status) query = query.eq('status', status)
    const { data, error } = await query
    if (error) throw new Error(error.message)
    return NextResponse.json({ matches: (data ?? []) as PvpMatchRow[], source: 'supabase' })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unexpected PvP error'
    return NextResponse.json({ error: message }, { status: message.toLowerCase().includes('supabase is not configured') ? 503 : 500 })
  }
}

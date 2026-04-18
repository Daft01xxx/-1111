import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClientOrNull } from '@/lib/server/supabase-admin'

const ADMIN_CODE = 'napiwasadmin2024'

async function airdropSupabaseNapiwas(amount: number) {
  const supabase = createSupabaseAdminClientOrNull()
  if (!supabase) throw new Error('Supabase is not configured')

  const { data: users, error: fetchUsersError } = await supabase.from('users').select('wallet_address').not('wallet_address', 'is', null)
  if (fetchUsersError) throw new Error(fetchUsersError.message)

  const wallets = (users || [])
    .map((row: Record<string, unknown>) => String(row.wallet_address || '').trim())
    .filter(Boolean)

  if (wallets.length === 0) {
    return { affectedUsers: 0, amount, source: 'supabase' as const }
  }

  const { data: rewardRows, error: rewardRowsError } = await supabase
    .from('reward_wallets')
    .select('wallet_address,pending_napiwas,total_earned_napiwas')
    .in('wallet_address', wallets)
  if (rewardRowsError) throw new Error(rewardRowsError.message)

  const existingSet = new Set((rewardRows || []).map((row: Record<string, unknown>) => String(row.wallet_address || '')))
  const toInsert = wallets.filter((wallet) => !existingSet.has(wallet))

  if (toInsert.length > 0) {
    const { error: insertRewardsError } = await supabase.from('reward_wallets').insert(
      toInsert.map((wallet) => ({
        wallet_address: wallet,
        pending_napiwas: amount,
        total_earned_napiwas: amount,
        total_withdrawn_napiwas: 0,
      }))
    )
    if (insertRewardsError) throw new Error(insertRewardsError.message)
  }

  for (const row of rewardRows || []) {
    const wallet = String((row as Record<string, unknown>).wallet_address || '')
    if (!wallet) continue
    const pending = Number((row as Record<string, unknown>).pending_napiwas || 0) + amount
    const earned = Number((row as Record<string, unknown>).total_earned_napiwas || 0) + amount
    const { error: updateRewardError } = await supabase
      .from('reward_wallets')
      .update({
        pending_napiwas: pending,
        total_earned_napiwas: earned,
        updated_at: new Date().toISOString(),
      })
      .eq('wallet_address', wallet)
    if (updateRewardError) throw new Error(updateRewardError.message)
  }

  return { affectedUsers: wallets.length, amount, source: 'supabase' as const }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { action, adminCode, ...data } = body as Record<string, unknown>

    if (adminCode !== ADMIN_CODE) {
      return NextResponse.json({ error: 'Invalid admin code' }, { status: 401 })
    }

    if (action === 'verify') {
      return NextResponse.json({ success: true, verified: true })
    }

    const supabase = createSupabaseAdminClientOrNull()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
    }

    if (action === 'airdrop_test_napiwas') {
      const amount = Math.max(0, Math.floor(Number(data.amount || 100)))
      const result = await airdropSupabaseNapiwas(amount)
      return NextResponse.json({ success: true, ...result })
    }

    switch (action) {
      case 'add_music': {
        const { title, artist, url, unlock_score, unlock_requirement } = data as Record<string, unknown>
        const { data: track, error } = await supabase
          .from('music_tracks')
          .insert({
            title,
            artist,
            file_url: url,
            unlock_requirement: Number(unlock_requirement ?? unlock_score ?? 0) || 0,
            is_active: true,
          })
          .select()
          .single()
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ track })
      }

      case 'delete_music': {
        const { track_id } = data as Record<string, unknown>
        const { error } = await supabase.from('music_tracks').delete().eq('id', track_id)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true })
      }

      case 'add_partner': {
        const { name, logo_url, website_url, description, telegram_url, twitter_url } = data as Record<string, unknown>
        const { data: partner, error } = await supabase
          .from('partners')
          .insert({ name, logo_url, website_url, description, telegram_url, twitter_url, is_active: true })
          .select()
          .single()
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ partner })
      }

      case 'delete_partner': {
        const { partner_id } = data as Record<string, unknown>
        const { error } = await supabase.from('partners').delete().eq('id', partner_id)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true })
      }

      case 'add_dex_task': {
        const { name, dex_name, url, bonus_points, icon } = data as Record<string, unknown>
        const { data: task, error } = await supabase
          .from('dex_tasks')
          .insert({
            name,
            description: typeof dex_name === 'string' ? dex_name : null,
            url,
            bonus_points: bonus_points || 500,
            icon,
            is_active: true,
          })
          .select()
          .single()
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ task })
      }

      case 'get_stats': {
        const [usersRes, todayCheckinsRes, activePvpRes] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase.from('daily_checkins').select('id', { count: 'exact', head: true }).eq('checkin_date', new Date().toISOString().split('T')[0]),
          supabase.from('pvp_matches').select('id', { count: 'exact', head: true }).in('status', ['waiting', 'in_progress']),
        ])
        return NextResponse.json({
          totalUsers: Number(usersRes.count ?? 0),
          todayCheckins: Number(todayCheckinsRes.count ?? 0),
          activePvP: Number(activePvpRes.count ?? 0),
        })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected admin error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdminClientOrNull()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const type = request.nextUrl.searchParams.get('type')

  switch (type) {
    case 'music': {
      const { data, error } = await supabase.from('music_tracks').select('*').order('created_at', { ascending: false })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ tracks: data || [] })
    }
    case 'partners': {
      const { data, error } = await supabase.from('partners').select('*').order('sort_order', { ascending: true })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ partners: data || [] })
    }
    case 'dex_tasks': {
      const { data, error } = await supabase.from('dex_tasks').select('*').eq('is_active', true).order('created_at', { ascending: false })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ tasks: data || [] })
    }
    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }
}

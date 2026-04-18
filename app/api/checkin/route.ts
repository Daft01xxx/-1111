import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClientOrNull } from '@/lib/server/supabase-admin'

const STREAK_BONUSES = [100, 150, 200, 300, 400, 500, 1000]

function normalizeWallet(input: unknown) {
  if (typeof input !== 'string') return ''
  return input.trim()
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayDate() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

export async function POST(request: NextRequest) {
  const supabase = createSupabaseAdminClientOrNull()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const walletAddress = normalizeWallet((body as Record<string, unknown>)?.wallet_address)

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
  }

  try {
    const today = getTodayDate()
    const yesterday = getYesterdayDate()

    const { data: todayCheckin, error: todayCheckinError } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('checkin_date', today)
      .maybeSingle()

    if (todayCheckinError) throw new Error(todayCheckinError.message)
    if (todayCheckin) {
      return NextResponse.json({ error: 'Already checked in today', alreadyCheckedIn: true }, { status: 400 })
    }

    const { data: yesterdayCheckin, error: yesterdayError } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('checkin_date', yesterday)
      .maybeSingle()

    if (yesterdayError) throw new Error(yesterdayError.message)

    const streak = yesterdayCheckin?.streak_count ? Number(yesterdayCheckin.streak_count) + 1 : 1
    const bonus = STREAK_BONUSES[Math.min(streak - 1, STREAK_BONUSES.length - 1)]

    const { error: insertError } = await supabase.from('daily_checkins').insert({
      wallet_address: walletAddress,
      checkin_date: today,
      streak_count: streak,
      bonus_earned: bonus,
    })

    if (insertError) throw new Error(insertError.message)

    const { data: user, error: userFetchError } = await supabase
      .from('users')
      .select('total_score')
      .eq('wallet_address', walletAddress)
      .maybeSingle()

    if (userFetchError) throw new Error(userFetchError.message)

    if (user) {
      const { error: updateUserError } = await supabase
        .from('users')
        .update({
          total_score: Number(user.total_score || 0) + bonus,
          updated_at: new Date().toISOString(),
        })
        .eq('wallet_address', walletAddress)

      if (updateUserError) throw new Error(updateUserError.message)
    }

    return NextResponse.json({
      success: true,
      streak,
      bonus,
      nextBonus: STREAK_BONUSES[Math.min(streak, STREAK_BONUSES.length - 1)],
      source: 'supabase',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected check-in error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdminClientOrNull()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const walletAddress = normalizeWallet(request.nextUrl.searchParams.get('wallet'))
  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
  }

  try {
    const today = getTodayDate()

    const { data: todayCheckin, error: todayError } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('wallet_address', walletAddress)
      .eq('checkin_date', today)
      .maybeSingle()

    if (todayError) throw new Error(todayError.message)

    const { data: history, error: historyError } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('checkin_date', { ascending: false })
      .limit(30)

    if (historyError) throw new Error(historyError.message)

    const currentStreak = Number(todayCheckin?.streak_count || 0)

    return NextResponse.json({
      checkedInToday: !!todayCheckin,
      currentStreak,
      history: history || [],
      nextBonus: STREAK_BONUSES[Math.min(currentStreak, STREAK_BONUSES.length - 1)],
      source: 'supabase',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected check-in error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

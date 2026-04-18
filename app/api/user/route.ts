import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClientOrNull } from '@/lib/server/supabase-admin'

function normalizeWallet(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function normalizeUsername(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export async function POST(request: NextRequest) {
  const supabase = createSupabaseAdminClientOrNull()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const walletAddress = normalizeWallet((body as Record<string, unknown>)?.wallet_address)
  const username = normalizeUsername((body as Record<string, unknown>)?.username)

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
  }

  try {
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .maybeSingle()

    if (existingError) throw new Error(existingError.message)

    if (existingUser) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('wallet_address', walletAddress)

      if (updateError) throw new Error(updateError.message)
      return NextResponse.json({ user: existingUser, isNew: false, source: 'supabase' })
    }

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        wallet_address: walletAddress,
        username: username || `Player_${walletAddress.slice(-6)}`,
        napiwas_balance: 0,
        total_score: 0,
        high_score: 0,
        bosses_defeated: 0,
        current_level: 1,
        multiplier: 1.0,
      })
      .select('*')
      .single()

    if (insertError) throw new Error(insertError.message)
    return NextResponse.json({ user: newUser, isNew: true, source: 'supabase' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected user API error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = createSupabaseAdminClientOrNull()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const wallet = normalizeWallet(request.nextUrl.searchParams.get('wallet'))
  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
  }

  try {
    const { data: user, error } = await supabase.from('users').select('*').eq('wallet_address', wallet).maybeSingle()
    if (error) throw new Error(error.message)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ user, source: 'supabase' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected user API error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

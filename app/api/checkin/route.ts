"use server"

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const STREAK_BONUSES = [100, 150, 200, 300, 400, 500, 1000]

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { wallet_address } = body

  if (!wallet_address) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  const today = new Date().toISOString().split("T")[0]

  // Check if already checked in today
  const { data: todayCheckin } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("wallet_address", wallet_address)
    .eq("checkin_date", today)
    .single()

  if (todayCheckin) {
    return NextResponse.json({ 
      error: "Already checked in today", 
      alreadyCheckedIn: true 
    }, { status: 400 })
  }

  // Get yesterday's check-in for streak calculation
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  const { data: yesterdayCheckin } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("wallet_address", wallet_address)
    .eq("checkin_date", yesterdayStr)
    .single()

  const newStreak = yesterdayCheckin ? yesterdayCheckin.streak_count + 1 : 1
  const streakIndex = Math.min(newStreak - 1, STREAK_BONUSES.length - 1)
  const bonus = STREAK_BONUSES[streakIndex]

  // Create check-in
  const { error: checkinError } = await supabase.from("daily_checkins").insert({
    wallet_address,
    checkin_date: today,
    streak_count: newStreak,
    bonus_earned: bonus,
  })

  if (checkinError) {
    return NextResponse.json({ error: checkinError.message }, { status: 500 })
  }

  // Update user total score with bonus
  const { data: user } = await supabase
    .from("users")
    .select("total_score")
    .eq("wallet_address", wallet_address)
    .single()

  if (user) {
    await supabase
      .from("users")
      .update({ total_score: user.total_score + bonus })
      .eq("wallet_address", wallet_address)
  }

  return NextResponse.json({
    success: true,
    streak: newStreak,
    bonus,
    nextBonus: STREAK_BONUSES[Math.min(newStreak, STREAK_BONUSES.length - 1)],
  })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const wallet = searchParams.get("wallet")

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  const today = new Date().toISOString().split("T")[0]

  const { data: todayCheckin } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("wallet_address", wallet)
    .eq("checkin_date", today)
    .single()

  const { data: history } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("wallet_address", wallet)
    .order("checkin_date", { ascending: false })
    .limit(30)

  const currentStreak = todayCheckin?.streak_count || 0

  return NextResponse.json({
    checkedInToday: !!todayCheckin,
    currentStreak,
    history: history || [],
    nextBonus: STREAK_BONUSES[Math.min(currentStreak, STREAK_BONUSES.length - 1)],
  })
}

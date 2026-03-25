"use server"

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { wallet_address, score, level, bosses_defeated } = body

  if (!wallet_address || score === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Get user and their multiplier
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", wallet_address)
    .single()

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const multiplier = user.multiplier || 1.0
  const finalScore = Math.floor(score * multiplier)

  // Update user stats
  const updates: Record<string, number | string> = {
    total_score: user.total_score + finalScore,
    updated_at: new Date().toISOString(),
  }

  if (finalScore > user.highest_score) {
    updates.highest_score = finalScore
  }

  if (level && level > user.current_level) {
    updates.current_level = level
  }

  if (bosses_defeated) {
    updates.bosses_defeated = user.bosses_defeated + bosses_defeated
  }

  await supabase
    .from("users")
    .update(updates)
    .eq("wallet_address", wallet_address)

  // Add to leaderboard
  const today = new Date().toISOString().split("T")[0]
  
  const { data: existingEntry } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("wallet_address", wallet_address)
    .eq("period", "daily")
    .eq("period_start", today)
    .single()

  if (existingEntry) {
    if (finalScore > existingEntry.score) {
      await supabase
        .from("leaderboard")
        .update({ score: finalScore })
        .eq("id", existingEntry.id)
    }
  } else {
    await supabase.from("leaderboard").insert({
      wallet_address,
      username: user.username,
      score: finalScore,
      level: level || user.current_level,
      period: "daily",
      period_start: today,
    })
  }

  // Also update all-time leaderboard
  const { data: allTimeEntry } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("wallet_address", wallet_address)
    .eq("period", "all_time")
    .single()

  if (allTimeEntry) {
    if (finalScore > allTimeEntry.score) {
      await supabase
        .from("leaderboard")
        .update({ score: finalScore })
        .eq("id", allTimeEntry.id)
    }
  } else {
    await supabase.from("leaderboard").insert({
      wallet_address,
      username: user.username,
      score: finalScore,
      level: level || user.current_level,
      period: "all_time",
      period_start: "2024-01-01",
    })
  }

  return NextResponse.json({ 
    success: true, 
    finalScore, 
    multiplier,
    newHighScore: finalScore > user.highest_score 
  })
}

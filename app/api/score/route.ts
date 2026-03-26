import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { wallet_address, username, score, level, meters, bosses_defeated, multiplier_used } = body

  if (!wallet_address || score === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Get or create user
  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", wallet_address)
    .single()

  if (!user) {
    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({ 
        wallet_address,
        username: username || `Player_${wallet_address.slice(-6)}`,
        high_score: 0,
        total_score: 0,
        level: 1,
        meters: 0,
        bosses_defeated: 0,
        games_played: 0,
        multiplier: multiplier_used || 1.0
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }
    user = newUser
  }

  const finalMultiplier = multiplier_used || user?.multiplier || 1.0
  const finalScore = Math.floor(score * finalMultiplier)

  // Update user stats
  const userUpdates: Record<string, unknown> = {
    total_score: (user?.total_score || 0) + finalScore,
    games_played: (user?.games_played || 0) + 1,
    meters: (user?.meters || 0) + (meters || 0),
    updated_at: new Date().toISOString(),
  }

  if (finalScore > (user?.high_score || 0)) {
    userUpdates.high_score = finalScore
  }

  if (level && level > (user?.level || 1)) {
    userUpdates.level = level
  }

  if (bosses_defeated) {
    userUpdates.bosses_defeated = (user?.bosses_defeated || 0) + bosses_defeated
  }

  await supabase
    .from("users")
    .update(userUpdates)
    .eq("wallet_address", wallet_address)

  // Add to leaderboard (each game creates a new entry)
  await supabase.from("leaderboard").insert({
    wallet_address,
    username: username || user?.username || `Player_${wallet_address.slice(-6)}`,
    score: finalScore,
    level: level || user?.level || 1,
    meters: meters || 0,
    bosses_defeated: bosses_defeated || 0,
    multiplier_used: finalMultiplier,
    created_at: new Date().toISOString(),
  })

  return NextResponse.json({ 
    success: true, 
    finalScore, 
    multiplier: finalMultiplier,
    newHighScore: finalScore > (user?.high_score || 0)
  })
}

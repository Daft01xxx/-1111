"use server"

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { action, ...data } = body

  switch (action) {
    case "create": {
      const { creator_wallet, bet_amount, match_type, max_players } = data

      const { data: match, error } = await supabase
        .from("pvp_matches")
        .insert({
          creator_wallet,
          bet_amount: bet_amount || 0,
          match_type: match_type || "high_score",
          status: "waiting",
          max_players: max_players || 2,
          current_players: 1,
          player_scores: { [creator_wallet]: null },
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ match })
    }

    case "join": {
      const { match_id, wallet_address } = data

      const { data: match } = await supabase
        .from("pvp_matches")
        .select("*")
        .eq("id", match_id)
        .single()

      if (!match) {
        return NextResponse.json({ error: "Match not found" }, { status: 404 })
      }

      if (match.status !== "waiting") {
        return NextResponse.json({ error: "Match not available" }, { status: 400 })
      }

      if (match.current_players >= match.max_players) {
        return NextResponse.json({ error: "Match is full" }, { status: 400 })
      }

      const playerScores = match.player_scores || {}
      playerScores[wallet_address] = null

      const newStatus = match.current_players + 1 >= match.max_players ? "in_progress" : "waiting"

      const { error } = await supabase
        .from("pvp_matches")
        .update({
          current_players: match.current_players + 1,
          player_scores: playerScores,
          status: newStatus,
          started_at: newStatus === "in_progress" ? new Date().toISOString() : null,
        })
        .eq("id", match_id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, status: newStatus })
    }

    case "submit_score": {
      const { match_id, wallet_address, score } = data

      const { data: match } = await supabase
        .from("pvp_matches")
        .select("*")
        .eq("id", match_id)
        .single()

      if (!match) {
        return NextResponse.json({ error: "Match not found" }, { status: 404 })
      }

      const playerScores = match.player_scores || {}
      playerScores[wallet_address] = score

      // Check if all players submitted
      const allSubmitted = Object.values(playerScores).every((s) => s !== null)

      let updates: Record<string, unknown> = { player_scores: playerScores }

      if (allSubmitted) {
        // Determine winner
        const entries = Object.entries(playerScores) as [string, number][]
        entries.sort((a, b) => b[1] - a[1])
        const winner = entries[0][0]

        updates = {
          ...updates,
          status: "completed",
          winner_wallet: winner,
          ended_at: new Date().toISOString(),
        }
      }

      const { error } = await supabase
        .from("pvp_matches")
        .update(updates)
        .eq("id", match_id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        allSubmitted,
        winner: allSubmitted ? updates.winner_wallet : null
      })
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status") || "waiting"

  const { data, error } = await supabase
    .from("pvp_matches")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ matches: data })
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const wallet = searchParams.get("wallet")

  // Get all active tracks
  const { data: tracks } = await supabase
    .from("music_tracks")
    .select("*")
    .eq("is_active", true)
    .order("unlock_score", { ascending: true })

  if (!wallet) {
    // Return all tracks with unlock status based on score requirement
    return NextResponse.json({ 
      tracks: tracks?.map(t => ({ ...t, unlocked: t.unlock_score === 0 })) || [] 
    })
  }

  // Get user's score
  const { data: user } = await supabase
    .from("users")
    .select("total_score")
    .eq("wallet_address", wallet)
    .single()

  const userScore = user?.total_score || 0

  // Get user's unlocked tracks
  const { data: unlocks } = await supabase
    .from("user_unlocks")
    .select("item_id")
    .eq("wallet_address", wallet)
    .eq("unlock_type", "music")

  const unlockedIds = new Set(unlocks?.map(u => u.item_id) || [])

  // Map tracks with unlock status
  const tracksWithStatus = tracks?.map(track => ({
    ...track,
    unlocked: track.unlock_score <= userScore || unlockedIds.has(track.id),
    canUnlock: track.unlock_score <= userScore && !unlockedIds.has(track.id),
  })) || []

  return NextResponse.json({ tracks: tracksWithStatus, userScore })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { wallet_address, track_id } = body

  if (!wallet_address || !track_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Check if already unlocked
  const { data: existing } = await supabase
    .from("user_unlocks")
    .select("*")
    .eq("wallet_address", wallet_address)
    .eq("item_id", track_id)
    .eq("unlock_type", "music")
    .single()

  if (existing) {
    return NextResponse.json({ error: "Already unlocked" }, { status: 400 })
  }

  // Get track and user
  const { data: track } = await supabase
    .from("music_tracks")
    .select("*")
    .eq("id", track_id)
    .single()

  const { data: user } = await supabase
    .from("users")
    .select("total_score")
    .eq("wallet_address", wallet_address)
    .single()

  if (!track || !user) {
    return NextResponse.json({ error: "Track or user not found" }, { status: 404 })
  }

  if (user.total_score < track.unlock_score) {
    return NextResponse.json({ error: "Not enough score to unlock" }, { status: 400 })
  }

  // Create unlock
  const { error } = await supabase.from("user_unlocks").insert({
    wallet_address,
    unlock_type: "music",
    item_id: track_id,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, track })
}

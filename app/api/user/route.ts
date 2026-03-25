"use server"

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { wallet_address, username } = body

  if (!wallet_address) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  // Check if user exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", wallet_address)
    .single()

  if (existingUser) {
    // Update last login
    await supabase
      .from("users")
      .update({ updated_at: new Date().toISOString() })
      .eq("wallet_address", wallet_address)
    
    return NextResponse.json({ user: existingUser, isNew: false })
  }

  // Create new user
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      wallet_address,
      username: username || `Player_${wallet_address.slice(0, 6)}`,
      napiwas_balance: 0,
      total_score: 0,
      highest_score: 0,
      bosses_defeated: 0,
      current_level: 1,
      multiplier: 1.0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ user: newUser, isNew: true })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const wallet = searchParams.get("wallet")

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("wallet_address", wallet)
    .single()

  if (error) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ user })
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get("period") || "all_time"
  const limit = parseInt(searchParams.get("limit") || "100")

  let periodStart = "2024-01-01"
  
  if (period === "daily") {
    periodStart = new Date().toISOString().split("T")[0]
  } else if (period === "weekly") {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))
    periodStart = monday.toISOString().split("T")[0]
  }

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("period", period)
    .gte("period_start", periodStart)
    .order("score", { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ leaderboard: data })
}

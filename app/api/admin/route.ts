"use server"

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

const ADMIN_CODE = "napiwasadmin2024"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { action, adminCode, ...data } = body

  if (adminCode !== ADMIN_CODE) {
    return NextResponse.json({ error: "Invalid admin code" }, { status: 401 })
  }

  switch (action) {
    case "verify": {
      return NextResponse.json({ success: true, verified: true })
    }

    case "add_music": {
      const { title, artist, url, unlock_score } = data

      const { data: track, error } = await supabase
        .from("music_tracks")
        .insert({
          title,
          artist,
          file_url: url,
          unlock_score: unlock_score || 0,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ track })
    }

    case "delete_music": {
      const { track_id } = data

      const { error } = await supabase
        .from("music_tracks")
        .delete()
        .eq("id", track_id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    case "add_partner": {
      const { name, logo_url, website_url, description, telegram_url, twitter_url } = data

      const { data: partner, error } = await supabase
        .from("partners")
        .insert({
          name,
          logo_url,
          website_url,
          description,
          telegram_url,
          twitter_url,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ partner })
    }

    case "delete_partner": {
      const { partner_id } = data

      const { error } = await supabase
        .from("partners")
        .delete()
        .eq("id", partner_id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    case "add_dex_task": {
      const { name, dex_name, url, bonus_points, icon } = data

      const { data: task, error } = await supabase
        .from("dex_tasks")
        .insert({
          name,
          dex_name,
          url,
          bonus_points: bonus_points || 500,
          icon,
          is_active: true,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ task })
    }

    case "get_stats": {
      const { data: users } = await supabase
        .from("users")
        .select("id", { count: "exact" })

      const { data: todayCheckins } = await supabase
        .from("daily_checkins")
        .select("id", { count: "exact" })
        .eq("checkin_date", new Date().toISOString().split("T")[0])

      const { data: activePvP } = await supabase
        .from("pvp_matches")
        .select("id", { count: "exact" })
        .in("status", ["waiting", "in_progress"])

      return NextResponse.json({
        totalUsers: users?.length || 0,
        todayCheckins: todayCheckins?.length || 0,
        activePvP: activePvP?.length || 0,
      })
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type")

  switch (type) {
    case "music": {
      const { data } = await supabase
        .from("music_tracks")
        .select("*")
        .order("created_at", { ascending: false })

      return NextResponse.json({ tracks: data || [] })
    }

    case "partners": {
      const { data } = await supabase
        .from("partners")
        .select("*")
        .order("sort_order", { ascending: true })

      return NextResponse.json({ partners: data || [] })
    }

    case "dex_tasks": {
      const { data } = await supabase
        .from("dex_tasks")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      return NextResponse.json({ tasks: data || [] })
    }

    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  }
}

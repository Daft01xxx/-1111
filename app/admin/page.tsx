'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { 
  Lock, Shield, Users, Music, Handshake, BarChart3, 
  Plus, Trash2, Upload, Save, ArrowLeft, Eye, EyeOff
} from 'lucide-react'
import Link from 'next/link'

const ADMIN_PASSWORD = 'napiwasadmin2024'

interface MusicTrack {
  id: string
  title: string
  artist: string
  url: string
  unlock_score: number
  is_active: boolean
}

interface Partner {
  id: string
  name: string
  logo_url: string
  website_url: string
  description: string
  order_index: number
  is_active: boolean
}

interface Stats {
  totalUsers: number
  totalGames: number
  totalPvpMatches: number
  activeUsers24h: number
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  
  const [activeTab, setActiveTab] = useState<'stats' | 'music' | 'partners' | 'tasks'>('stats')
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalGames: 0, totalPvpMatches: 0, activeUsers24h: 0 })
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(false)

  // New track form
  const [newTrack, setNewTrack] = useState({ title: '', artist: '', url: '', unlock_score: 0 })
  // New partner form  
  const [newPartner, setNewPartner] = useState({ name: '', logo_url: '', website_url: '', description: '' })

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
      fetchData()
    } else {
      setError('Invalid password')
    }
  }

  const fetchData = async () => {
    setLoading(true)
    const supabase = createClient()

    // Get stats
    const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
    const { count: gamesCount } = await supabase.from('leaderboard').select('*', { count: 'exact', head: true })
    const { count: pvpCount } = await supabase.from('pvp_matches').select('*', { count: 'exact', head: true })
    
    // Active users in last 24h
    const yesterday = new Date(Date.now() - 86400000).toISOString()
    const { count: activeCount } = await supabase
      .from('leaderboard')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday)

    setStats({
      totalUsers: usersCount || 0,
      totalGames: gamesCount || 0,
      totalPvpMatches: pvpCount || 0,
      activeUsers24h: activeCount || 0,
    })

    // Get music tracks
    const { data: musicData } = await supabase
      .from('music_tracks')
      .select('*')
      .order('unlock_score', { ascending: true })
    if (musicData) setTracks(musicData)

    // Get partners
    const { data: partnersData } = await supabase
      .from('partners')
      .select('*')
      .order('order_index', { ascending: true })
    if (partnersData) setPartners(partnersData)

    setLoading(false)
  }

  const handleAddTrack = async () => {
    if (!newTrack.title || !newTrack.url) return
    
    const supabase = createClient()
    const { error } = await supabase.from('music_tracks').insert({
      ...newTrack,
      is_active: true,
    })

    if (!error) {
      setNewTrack({ title: '', artist: '', url: '', unlock_score: 0 })
      fetchData()
    }
  }

  const handleDeleteTrack = async (id: string) => {
    const supabase = createClient()
    await supabase.from('music_tracks').delete().eq('id', id)
    fetchData()
  }

  const handleToggleTrack = async (id: string, isActive: boolean) => {
    const supabase = createClient()
    await supabase.from('music_tracks').update({ is_active: !isActive }).eq('id', id)
    fetchData()
  }

  const handleAddPartner = async () => {
    if (!newPartner.name || !newPartner.website_url) return
    
    const supabase = createClient()
    const { error } = await supabase.from('partners').insert({
      ...newPartner,
      order_index: partners.length,
      is_active: true,
    })

    if (!error) {
      setNewPartner({ name: '', logo_url: '', website_url: '', description: '' })
      fetchData()
    }
  }

  const handleDeletePartner = async (id: string) => {
    const supabase = createClient()
    await supabase.from('partners').delete().eq('id', id)
    fetchData()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-dark-900 rounded-2xl border border-dark-700 p-6"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-beer-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-beer-400" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foam-100">Admin Panel</h1>
            <p className="text-sm text-foam-500 mt-1">Enter password to continue</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-dark-800 border border-dark-600 text-foam-100 placeholder-foam-500 focus:border-beer-500 focus:outline-none"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foam-500 hover:text-foam-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl beer-gradient text-dark-950 font-bold hover:brightness-110 transition-all"
            >
              Login
            </button>

            <Link href="/" className="block text-center text-sm text-foam-500 hover:text-foam-300">
              Back to game
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-dark-950/90 backdrop-blur-sm border-b border-dark-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 -m-2 rounded-lg hover:bg-dark-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-foam-100" />
          </Link>
          <h1 className="text-xl font-display font-bold beer-text flex items-center gap-2">
            <Shield className="w-5 h-5 text-beer-400" />
            Admin Panel
          </h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-sm text-foam-500 hover:text-foam-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {[
          { id: 'stats', icon: BarChart3, label: 'Stats' },
          { id: 'music', icon: Music, label: 'Music' },
          { id: 'partners', icon: Handshake, label: 'Partners' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors
              ${activeTab === tab.id 
                ? 'bg-beer-500 text-dark-950' 
                : 'bg-dark-800 text-foam-400 hover:bg-dark-700'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
                <div className="flex items-center gap-2 text-foam-500 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Total Users</span>
                </div>
                <p className="text-3xl font-bold beer-text">{stats.totalUsers}</p>
              </div>
              
              <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
                <div className="flex items-center gap-2 text-foam-500 mb-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">Total Games</span>
                </div>
                <p className="text-3xl font-bold beer-text">{stats.totalGames}</p>
              </div>
              
              <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
                <div className="flex items-center gap-2 text-foam-500 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Active (24h)</span>
                </div>
                <p className="text-3xl font-bold text-green-400">{stats.activeUsers24h}</p>
              </div>
              
              <div className="bg-dark-900 rounded-xl border border-dark-700 p-4">
                <div className="flex items-center gap-2 text-foam-500 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">PvP Matches</span>
                </div>
                <p className="text-3xl font-bold text-purple-400">{stats.totalPvpMatches}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Music Tab */}
        {activeTab === 'music' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Add track form */}
            <div className="bg-dark-900 rounded-xl border border-dark-700 p-4 space-y-3">
              <h3 className="font-bold text-foam-100">Add New Track</h3>
              <input
                type="text"
                value={newTrack.title}
                onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                placeholder="Track title"
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-foam-100 placeholder-foam-500 focus:border-beer-500 focus:outline-none"
              />
              <input
                type="text"
                value={newTrack.artist}
                onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                placeholder="Artist name"
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-foam-100 placeholder-foam-500 focus:border-beer-500 focus:outline-none"
              />
              <input
                type="text"
                value={newTrack.url}
                onChange={(e) => setNewTrack({ ...newTrack, url: e.target.value })}
                placeholder="Audio URL (mp3)"
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-foam-100 placeholder-foam-500 focus:border-beer-500 focus:outline-none"
              />
              <input
                type="number"
                value={newTrack.unlock_score}
                onChange={(e) => setNewTrack({ ...newTrack, unlock_score: parseInt(e.target.value) || 0 })}
                placeholder="Unlock score (0 = free)"
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-foam-100 placeholder-foam-500 focus:border-beer-500 focus:outline-none"
              />
              <button
                onClick={handleAddTrack}
                className="w-full py-2 rounded-lg beer-gradient text-dark-950 font-bold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Track
              </button>
            </div>

            {/* Tracks list */}
            <div className="space-y-2">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl bg-dark-900 border
                    ${track.is_active ? 'border-dark-700' : 'border-dark-800 opacity-50'}
                  `}
                >
                  <div className="w-10 h-10 rounded-lg bg-beer-500/20 flex items-center justify-center">
                    <Music className="w-5 h-5 text-beer-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foam-100 truncate">{track.title}</p>
                    <p className="text-xs text-foam-500">{track.artist} | {track.unlock_score} pts</p>
                  </div>
                  <button
                    onClick={() => handleToggleTrack(track.id, track.is_active)}
                    className={`p-2 rounded-lg ${track.is_active ? 'bg-green-500/20 text-green-400' : 'bg-dark-700 text-foam-500'}`}
                  >
                    {track.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteTrack(track.id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Partners Tab */}
        {activeTab === 'partners' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Add partner form */}
            <div className="bg-dark-900 rounded-xl border border-dark-700 p-4 space-y-3">
              <h3 className="font-bold text-foam-100">Add New Partner</h3>
              <input
                type="text"
                value={newPartner.name}
                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                placeholder="Partner name"
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-foam-100 placeholder-foam-500 focus:border-beer-500 focus:outline-none"
              />
              <input
                type="text"
                value={newPartner.logo_url}
                onChange={(e) => setNewPartner({ ...newPartner, logo_url: e.target.value })}
                placeholder="Logo URL"
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-foam-100 placeholder-foam-500 focus:border-beer-500 focus:outline-none"
              />
              <input
                type="text"
                value={newPartner.website_url}
                onChange={(e) => setNewPartner({ ...newPartner, website_url: e.target.value })}
                placeholder="Website URL"
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-foam-100 placeholder-foam-500 focus:border-beer-500 focus:outline-none"
              />
              <input
                type="text"
                value={newPartner.description}
                onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
                placeholder="Description"
                className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-foam-100 placeholder-foam-500 focus:border-beer-500 focus:outline-none"
              />
              <button
                onClick={handleAddPartner}
                className="w-full py-2 rounded-lg beer-gradient text-dark-950 font-bold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Partner
              </button>
            </div>

            {/* Partners list */}
            <div className="space-y-2">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark-900 border border-dark-700"
                >
                  {partner.logo_url ? (
                    <img 
                      src={partner.logo_url} 
                      alt={partner.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-beer-500/20 flex items-center justify-center">
                      <Handshake className="w-5 h-5 text-beer-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foam-100 truncate">{partner.name}</p>
                    <p className="text-xs text-foam-500 truncate">{partner.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeletePartner(partner.id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Music, Play, Pause, Lock, Volume2, ArrowLeft, SkipBack, SkipForward } from 'lucide-react'
import Link from 'next/link'

interface MusicTrack {
  id: string
  title: string
  artist: string
  url: string
  unlock_score: number
  is_active: boolean
}

export default function MusicPage() {
  const { highScore, musicVolume, setMusicVolume, currentTrack, setCurrentTrack } = useGameStore()
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchTracks = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('music_tracks')
        .select('*')
        .eq('is_active', true)
        .order('unlock_score', { ascending: true })

      if (data) setTracks(data)
      setLoading(false)
    }

    fetchTracks()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume
    }
  }, [musicVolume])

  const isUnlocked = (track: MusicTrack) => highScore >= track.unlock_score

  const playTrack = (track: MusicTrack) => {
    if (!isUnlocked(track)) return

    if (currentTrack === track.url) {
      // Toggle play/pause
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        audioRef.current?.play()
        setIsPlaying(true)
      }
    } else {
      // Play new track
      setCurrentTrack(track.url)
      setIsPlaying(true)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const playNext = () => {
    const currentIndex = tracks.findIndex(t => t.url === currentTrack)
    const nextTracks = tracks.slice(currentIndex + 1).filter(t => isUnlocked(t))
    if (nextTracks.length > 0) {
      setCurrentTrack(nextTracks[0].url)
      setIsPlaying(true)
    }
  }

  const playPrevious = () => {
    const currentIndex = tracks.findIndex(t => t.url === currentTrack)
    const prevTracks = tracks.slice(0, currentIndex).filter(t => isUnlocked(t))
    if (prevTracks.length > 0) {
      setCurrentTrack(prevTracks[prevTracks.length - 1].url)
      setIsPlaying(true)
    }
  }

  const currentTrackData = tracks.find(t => t.url === currentTrack)

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Audio element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack}
          autoPlay={isPlaying}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-dark-950/90 backdrop-blur-sm border-b border-dark-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 -m-2 rounded-lg hover:bg-dark-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-foam-100" />
          </Link>
          <h1 className="text-xl font-display font-bold beer-text flex items-center gap-2">
            <Music className="w-5 h-5 text-beer-400" />
            Jukebox
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Current high score */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-4 text-center">
          <p className="text-sm text-foam-500">Your High Score</p>
          <p className="text-2xl font-bold beer-text">{highScore.toLocaleString()}</p>
          <p className="text-xs text-foam-500 mt-1">Unlock tracks by reaching score milestones!</p>
        </div>

        {/* Now playing */}
        {currentTrackData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-900 rounded-2xl border border-beer-500/30 p-4 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl beer-gradient flex items-center justify-center">
                <Music className="w-8 h-8 text-dark-950" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foam-100 truncate">{currentTrackData.title}</p>
                <p className="text-sm text-foam-500">{currentTrackData.artist}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-beer-500"
              />
              <div className="flex justify-between text-xs text-foam-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={playPrevious}
                className="p-3 rounded-full bg-dark-800 text-foam-400 hover:bg-dark-700 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => playTrack(currentTrackData)}
                className="p-4 rounded-full beer-gradient text-dark-950 hover:brightness-110 transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button
                onClick={playNext}
                className="p-3 rounded-full bg-dark-800 text-foam-400 hover:bg-dark-700 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-foam-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-beer-500"
              />
            </div>
          </motion.div>
        )}

        {/* Tracks list */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-foam-100 px-1">All Tracks</h2>
          
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-dark-800 rounded-xl animate-pulse" />
            ))
          ) : tracks.length === 0 ? (
            <div className="text-center py-8 bg-dark-900 rounded-xl border border-dark-700">
              <Music className="w-12 h-12 text-dark-600 mx-auto mb-3" />
              <p className="text-foam-400">No tracks available yet</p>
            </div>
          ) : (
            tracks.map((track, index) => {
              const unlocked = isUnlocked(track)
              const isCurrentTrack = currentTrack === track.url
              
              return (
                <motion.button
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => playTrack(track)}
                  disabled={!unlocked}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                    ${isCurrentTrack 
                      ? 'bg-beer-500/20 border border-beer-500/30' 
                      : unlocked 
                        ? 'bg-dark-900 border border-dark-700 hover:border-beer-500/30' 
                        : 'bg-dark-900/50 border border-dark-800 opacity-60'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    ${isCurrentTrack ? 'beer-gradient' : unlocked ? 'bg-dark-800' : 'bg-dark-800'}
                  `}>
                    {unlocked ? (
                      isCurrentTrack && isPlaying ? (
                        <div className="flex gap-0.5">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-dark-950 rounded-full"
                              animate={{ height: [8, 16, 8] }}
                              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                      ) : (
                        <Play className={`w-5 h-5 ${isCurrentTrack ? 'text-dark-950' : 'text-foam-400'}`} />
                      )
                    ) : (
                      <Lock className="w-5 h-5 text-foam-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${unlocked ? 'text-foam-100' : 'text-foam-500'}`}>
                      {track.title}
                    </p>
                    <p className="text-xs text-foam-500">{track.artist}</p>
                  </div>
                  
                  {!unlocked && (
                    <div className="text-right">
                      <p className="text-xs text-foam-500">Unlock at</p>
                      <p className="text-sm font-bold text-beer-400">{track.unlock_score.toLocaleString()}</p>
                    </div>
                  )}
                </motion.button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

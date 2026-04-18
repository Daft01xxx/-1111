'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/lib/store'
import { Music, Play, Pause, Lock, Volume2, SkipBack, SkipForward } from 'lucide-react'
import { AppPageHeader } from '@/components/ui/app-page-header'

interface MusicTrack {
  id: string
  title: string
  artist: string
  file_url: string
  unlock_type: string
  unlock_requirement: number
  unlock_cost: number
  sort_order: number
  is_active: boolean
}

export default function MusicPage() {
  const { highScore, musicVolume, setMusicVolume, language, theme, selectedMusicTrack, setSelectedMusicTrack } = useGameStore()
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const forGameLabel = language === 'ru' ? 'Для игры' : 'For Game'
  const selectedLabel = language === 'ru' ? 'Выбрано' : 'Selected'

  const battleTracks: Array<{ title: string; artist: string; file_url: string }> = [
    { title: 'NaPiwas Main', artist: 'NAPIWAS', file_url: '/audio/napiwas-game-main.mp3' },
    { title: 'NaPiwas Alt', artist: 'NAPIWAS', file_url: '/audio/napiwas-game-alt.mp3' },
    { title: 'NaPiwas Menu', artist: 'NAPIWAS', file_url: '/audio/napiwas-menu.mp3' },
    { title: 'NaPiwas Game Over', artist: 'NAPIWAS', file_url: '/audio/napiwas-game-over.mp3' },
  ]

  const t = {
    title: language === 'ru' ? 'Музыка' : 'Jukebox',
    yourScore: language === 'ru' ? 'Ваш рекорд' : 'Your High Score',
    unlockHint: language === 'ru' ? 'Разблокируйте треки достигая рекордов!' : 'Unlock tracks by reaching score milestones!',
    allTracks: language === 'ru' ? 'Все треки' : 'All Tracks',
    noTracks: language === 'ru' ? 'Треки пока недоступны' : 'No tracks available yet',
    unlockAt: language === 'ru' ? 'Откроется на' : 'Unlock at',
    free: language === 'ru' ? 'Бесплатно' : 'Free',
  }

  useEffect(() => {
    const fetchTracks = async () => {
      const fallbackTracks: MusicTrack[] = battleTracks.map((track, index) => ({
        id: `local-${index}`,
        title: track.title,
        artist: track.artist,
        file_url: track.file_url,
        unlock_type: 'free',
        unlock_requirement: 0,
        unlock_cost: 0,
        sort_order: index,
        is_active: true,
      }))

      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('music_tracks')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (data && data.length > 0) {
          setTracks(data)
        } else {
          setTracks(fallbackTracks)
        }
      } catch {
        setTracks(fallbackTracks)
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume
    }
  }, [musicVolume])

  const isUnlocked = (track: MusicTrack) => {
    if (track.unlock_type === 'free') return true
    return highScore >= track.unlock_requirement
  }

  const playTrack = (track: MusicTrack) => {
    if (!isUnlocked(track)) return

    if (currentTrack === track.file_url) {
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        audioRef.current?.play()
        setIsPlaying(true)
      }
    } else {
      setCurrentTrack(track.file_url)
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
    const currentIndex = tracks.findIndex(t => t.file_url === currentTrack)
    const nextTracks = tracks.slice(currentIndex + 1).filter(t => isUnlocked(t))
    if (nextTracks.length > 0) {
      setCurrentTrack(nextTracks[0].file_url)
      setIsPlaying(true)
    }
  }

  const playPrevious = () => {
    const currentIndex = tracks.findIndex(t => t.file_url === currentTrack)
    const prevTracks = tracks.slice(0, currentIndex).filter(t => isUnlocked(t))
    if (prevTracks.length > 0) {
      setCurrentTrack(prevTracks[prevTracks.length - 1].file_url)
      setIsPlaying(true)
    }
  }

  const currentTrackData = tracks.find(t => t.file_url === currentTrack)
  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0A0A0B]' : 'bg-amber-50'}`}>
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

      <AppPageHeader
        title={t.title}
        icon={<Music className="w-5 h-5 text-amber-500" />}
      />

      <div className="p-4 space-y-4">
        <div className={`rounded-xl border p-4 text-center animate-fadeInUp ${
          isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-amber-200'
        }`}>
          <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-[#6f5b34]'}`}>{t.yourScore}</p>
          <p className="text-2xl font-bold text-amber-500">{highScore.toLocaleString()}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-neutral-500' : 'text-[#9a8358]'}`}>{t.unlockHint}</p>
        </div>

        {currentTrackData && (
          <div className={`rounded-2xl border p-4 space-y-4 animate-fadeInUp ${
            isDark ? 'bg-neutral-900 border-amber-500/30' : 'bg-white border-amber-300'
          }`} style={{ animationDelay: '50ms' }}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Music className="w-8 h-8 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {currentTrackData.title}
                </p>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {currentTrackData.artist}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className={`w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-500 ${isDark ? 'bg-neutral-700' : 'bg-amber-200'}`}
              />
              <div className={`flex justify-between text-xs ${isDark ? 'text-neutral-500' : 'text-[#8e7851]'}`}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={playPrevious}
                className={`p-3 rounded-full transition-colors active:scale-95 ${
                  isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-amber-100 text-[#6f5b34]'
                }`}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => playTrack(currentTrackData)}
                className="p-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black active:scale-95 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button
                onClick={playNext}
                className={`p-3 rounded-full transition-colors active:scale-95 ${
                  isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-amber-100 text-[#6f5b34]'
                }`}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Volume2 className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-[#8e7851]'}`} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className={`flex-1 h-2 rounded-full appearance-none cursor-pointer accent-amber-500 ${isDark ? 'bg-neutral-700' : 'bg-amber-200'}`}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h2 className={`text-lg font-bold px-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>{t.allTracks}</h2>

          <div className={`rounded-2xl border p-3 space-y-2 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-amber-200'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-neutral-400' : 'text-[#7f683f]'}`}>{forGameLabel}</p>
            {battleTracks.map((track) => {
              const selectedForGame = selectedMusicTrack === track.file_url
              return (
                <div
                  key={`battle-${track.file_url}`}
                  className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${isDark ? 'bg-black/20' : 'bg-amber-50 border border-amber-200/80'}`}
                >
                  <button
                    onClick={() =>
                      playTrack({
                        ...track,
                        id: track.file_url,
                        unlock_type: 'free',
                        unlock_requirement: 0,
                        unlock_cost: 0,
                        sort_order: 0,
                        is_active: true,
                      })
                    }
                    className={`text-left flex-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}
                  >
                    <p className="text-sm font-semibold truncate">{track.title}</p>
                    <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-[#8f784d]'}`}>{track.artist}</p>
                  </button>
                  <button
                    onClick={() => setSelectedMusicTrack(track.file_url)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedForGame ? 'bg-amber-500 text-black' : isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-amber-100 text-[#694f20]'
                    }`}
                  >
                    {selectedForGame ? selectedLabel : forGameLabel}
                  </button>
                </div>
              )
            })}
          </div>
          
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? 'bg-neutral-800' : 'bg-amber-100'}`} />
            ))
          ) : tracks.length === 0 ? (
            <div className={`text-center py-8 rounded-xl border ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-amber-200'
            }`}>
              <Music className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-neutral-600' : 'text-amber-400'}`} />
              <p className={isDark ? 'text-neutral-400' : 'text-[#7d6641]'}>{t.noTracks}</p>
            </div>
          ) : (
            tracks.map((track, index) => {
              const unlocked = isUnlocked(track)
              const isCurrentTrack = currentTrack === track.file_url
              
              return (
                <button
                  key={track.id}
                  onClick={() => playTrack(track)}
                  disabled={!unlocked}
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-[0.98] animate-fadeInUp opacity-0
                    ${isCurrentTrack 
                      ? isDark ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-amber-100 border border-amber-300'
                      : unlocked 
                        ? isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-amber-200'
                        : isDark ? 'bg-neutral-900/50 border border-neutral-800 opacity-60' : 'bg-neutral-100 border border-neutral-200 opacity-60'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    ${isCurrentTrack 
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600' 
                        : isDark ? 'bg-neutral-800' : 'bg-amber-100'
                    }
                  `}>
                    {unlocked ? (
                      isCurrentTrack && isPlaying ? (
                        <div className="flex gap-0.5 items-end h-4">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className={`w-1 rounded-full ${isCurrentTrack ? 'bg-black' : isDark ? 'bg-amber-500' : 'bg-amber-600'}`}
                              style={{
                                height: `${8 + Math.sin(Date.now() / 200 + i) * 6}px`,
                                animation: `pulse 0.5s ease-in-out ${i * 0.1}s infinite`
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <Play className={`w-5 h-5 ${isCurrentTrack ? 'text-black' : isDark ? 'text-neutral-400' : 'text-[#705830]'}`} />
                      )
                    ) : (
                      <Lock className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${unlocked ? (isDark ? 'text-white' : 'text-neutral-900') : (isDark ? 'text-neutral-500' : 'text-neutral-500')}`}>
                      {track.title}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-[#8f784d]'}`}>{track.artist}</p>
                  </div>
                  
                  {!unlocked && (
                    <div className="text-right">
                      <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-[#9a8259]'}`}>{t.unlockAt}</p>
                      <p className="text-sm font-bold text-amber-500">{track.unlock_requirement.toLocaleString()}</p>
                    </div>
                  )}
                  
                  {unlocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedMusicTrack(track.file_url)
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        selectedMusicTrack === track.file_url
                          ? 'bg-amber-500 text-black'
                          : isDark
                            ? 'bg-neutral-800 text-neutral-300'
                            : 'bg-amber-100 text-[#664e24]'
                      }`}
                    >
                      {selectedMusicTrack === track.file_url ? selectedLabel : forGameLabel}
                    </button>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

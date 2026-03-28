'use client'

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/lib/store'

// Free background tracks (looped, ~2 min each)
const FREE_TRACKS = {
  menu: {
    id: 'calm_cosmos',
    title: 'Calm Cosmos',
    // Using a peaceful ambient tone
    frequency: 220, // A3 - calm
    tempo: 80,
  },
  gameplay: {
    id: 'stellar_pursuit',
    title: 'Stellar Pursuit',
    // Upbeat gameplay music
    frequency: 330, // E4 - energetic
    tempo: 120,
  },
  boss: {
    id: 'boss_fury',
    title: 'Boss Fury',
    // Intense boss music
    frequency: 440, // A4 - intense
    tempo: 150,
  },
}

export function MusicManager() {
  const { gamePhase, musicVolume, isPlaying } = useGameStore()
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const [currentPhase, setCurrentPhase] = useState<string>('menu')
  const isInitializedRef = useRef(false)

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (audioContextRef.current) return
      
      try {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        gainNodeRef.current = audioContextRef.current.createGain()
        gainNodeRef.current.connect(audioContextRef.current.destination)
        gainNodeRef.current.gain.value = musicVolume * 0.3 // Reduce volume for generated audio
        isInitializedRef.current = true
      } catch (e) {
        console.error('Failed to initialize audio context:', e)
      }
    }

    // Add click listener to initialize audio
    document.addEventListener('click', initAudio, { once: true })
    document.addEventListener('touchstart', initAudio, { once: true })

    return () => {
      document.removeEventListener('click', initAudio)
      document.removeEventListener('touchstart', initAudio)
    }
  }, [musicVolume])

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = musicVolume * 0.3
    }
  }, [musicVolume])

  // Generate simple ambient music based on phase
  useEffect(() => {
    const targetPhase = isPlaying ? (gamePhase === 'boss' ? 'boss' : 'gameplay') : 'menu'
    
    if (targetPhase === currentPhase) return
    if (!audioContextRef.current || !gainNodeRef.current) return

    // Stop current oscillator
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop()
      } catch (e) {
        // Ignore - oscillator might already be stopped
      }
      oscillatorRef.current = null
    }

    // Create new oscillator for ambient sound
    const ctx = audioContextRef.current
    const track = FREE_TRACKS[targetPhase as keyof typeof FREE_TRACKS]
    
    if (!track || musicVolume === 0) {
      setCurrentPhase(targetPhase)
      return
    }

    try {
      // Create oscillator with smoother sound
      const osc = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      
      osc.type = 'sine'
      osc.frequency.value = track.frequency
      
      filter.type = 'lowpass'
      filter.frequency.value = 800
      filter.Q.value = 1
      
      osc.connect(filter)
      filter.connect(gainNodeRef.current!)
      
      // Add subtle frequency modulation for interest
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = track.tempo / 60 // Based on BPM
      lfoGain.gain.value = 5
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      
      osc.start()
      lfo.start()
      
      oscillatorRef.current = osc
      setCurrentPhase(targetPhase)
    } catch (e) {
      console.error('Failed to create oscillator:', e)
    }

    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop()
        } catch (e) {
          // Ignore
        }
      }
    }
  }, [gamePhase, isPlaying, currentPhase, musicVolume])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop()
        } catch (e) {
          // Ignore
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // This component doesn't render anything visible
  return null
}

// Hook for components to get current track info
export function useCurrentTrack() {
  const { gamePhase, isPlaying } = useGameStore()
  
  const phase = isPlaying ? (gamePhase === 'boss' ? 'boss' : 'gameplay') : 'menu'
  const track = FREE_TRACKS[phase as keyof typeof FREE_TRACKS]
  
  return {
    title: track?.title || 'Unknown',
    phase,
    isPlaying: true,
  }
}

'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { GameEngine } from './game-engine'
import { GameHUD } from './game-hud'
import { WeaponPanel } from './weapon-panel'
import { TouchControls } from './touch-controls'
import { GameOver } from './game-over'
import { PauseMenu } from './pause-menu'

export function GameContainer() {
  const { startGame, isPlaying } = useGameStore()

  useEffect(() => {
    // Auto-start game when component mounts
    if (!isPlaying) {
      startGame()
    }
  }, [startGame, isPlaying])

  return (
    <div className="relative w-full h-screen bg-dark-950 overflow-hidden">
      {/* Game canvas */}
      <div className="absolute inset-0">
        <GameEngine />
      </div>

      {/* HUD overlay */}
      <GameHUD />

      {/* Weapon panel (above touch controls) */}
      <WeaponPanel />

      {/* Touch controls area indicator */}
      <TouchControls />

      {/* Pause menu */}
      <PauseMenu />

      {/* Game over screen */}
      <GameOver />
    </div>
  )
}

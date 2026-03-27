'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { GameEngine } from './game-engine'
import { GameHUD } from './game-hud'
import { WeaponPanel } from './weapon-panel'
import { GameOver } from './game-over'
import { PauseMenu } from './pause-menu'

export function GameContainer() {
  const { startGame, isPlaying, gameOver } = useGameStore()

  useEffect(() => {
    if (!isPlaying && !gameOver) {
      startGame()
    }
  }, [startGame, isPlaying, gameOver])

  return (
    <div className="relative w-full h-screen bg-[rgb(var(--background))] overflow-hidden">
      {/* Game Canvas */}
      <div className="absolute inset-0">
        <GameEngine />
      </div>

      {/* HUD */}
      <GameHUD />

      {/* Weapon Panel */}
      <WeaponPanel />

      {/* Pause Menu */}
      <PauseMenu />

      {/* Game Over */}
      <GameOver />
    </div>
  )
}

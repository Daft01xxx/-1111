'use client'

import { useGameStore } from '@/lib/store'
import { motion } from 'framer-motion'

export function TouchControls() {
  const { isPlaying } = useGameStore()

  if (!isPlaying) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 h-28 z-10 pointer-events-none">
      {/* Visual indicator for touch area */}
      <div className="absolute inset-x-4 bottom-4 h-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full h-full rounded-2xl bg-dark-800/50 backdrop-blur-sm border border-dark-600/50 flex items-center justify-center"
        >
          <div className="flex items-center gap-3 text-foam-500">
            <motion.div
              animate={{ x: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-10 h-10 rounded-full bg-beer-500/30 border-2 border-beer-500/50 flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.div>
            <span className="text-xs">Slide to move</span>
          </div>
        </motion.div>
      </div>

      {/* Gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-dark-950 to-transparent" />
    </div>
  )
}

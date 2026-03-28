'use client'

import { useGameStore } from '@/lib/store'
import { Coins } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface CoinBalanceHeaderProps {
  showShopLink?: boolean
  className?: string
}

export function CoinBalanceHeader({ showShopLink = true, className = '' }: CoinBalanceHeaderProps) {
  const { coins } = useGameStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 ${className}`}
    >
      {showShopLink ? (
        <Link 
          href="/shop"
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl px-4 py-2 border border-amber-500/30 hover:border-amber-500/50 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center">
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            {coins.toLocaleString()}
          </span>
        </Link>
      ) : (
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl px-4 py-2 border border-amber-500/30">
          <div className="w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center">
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            {coins.toLocaleString()}
          </span>
        </div>
      )}
    </motion.div>
  )
}

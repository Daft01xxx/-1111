'use client'

import { motion } from 'framer-motion'
import { 
  Info, ArrowLeft, Gamepad2, Target, Shield, Zap, 
  Trophy, Wallet, Flame, Music, Swords, Gift
} from 'lucide-react'
import Link from 'next/link'

export default function GuidePage() {
  const sections = [
    {
      icon: Gamepad2,
      title: 'Basic Controls',
      content: 'Slide your finger left and right to move your beer mug spaceship. The ship auto-fires foam projectiles at enemies. Avoid getting hit!',
    },
    {
      icon: Target,
      title: 'Weapons',
      content: 'Start with the basic Foam Cannon. Unlock more powerful weapons like Hop Blaster, Malt Missile, Barley Beam, and the legendary Lager Laser by defeating bosses and earning points.',
    },
    {
      icon: Shield,
      title: 'Power-Ups',
      content: 'Collect power-ups that fall from defeated enemies: Shield (blocks damage), Double Shot, Triple Shot, Speed Boost, and Health packs. Power-ups can stack!',
    },
    {
      icon: Trophy,
      title: 'Scoring',
      content: 'Defeat enemies to earn points. Larger enemies give more points. Boss battles award massive point bonuses. Your multiplier increases your score earnings.',
    },
    {
      icon: Wallet,
      title: 'NAPIWAS Tokens',
      content: 'Connect your TON wallet and hold NAPIWAS tokens to earn score multipliers: 1000+ = 1.25x, 10000+ = 1.5x, 50000+ = 1.75x, 100000+ = 2.0x!',
    },
    {
      icon: Flame,
      title: 'Daily Rewards',
      content: 'Check in daily to earn bonus points. Build a streak for bigger rewards! Complete DEX tasks for additional bonuses.',
    },
    {
      icon: Swords,
      title: 'PvP Battles',
      content: 'Challenge other players to score battles or boss rush competitions. Create a match with a point bet, and winner takes the pot (minus 5% house fee).',
    },
    {
      icon: Music,
      title: 'Jukebox',
      content: 'Unlock new music tracks by reaching score milestones. Listen to your favorite tracks while playing!',
    },
    {
      icon: Gift,
      title: 'Boss Rush',
      content: 'Face 5 unique bosses: Vodka King, Whiskey Wizard, Wine Witch, Tequila Titan, and the final boss - Absinthe Overlord. Each has unique attack patterns!',
    },
  ]

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-dark-950/90 backdrop-blur-sm border-b border-dark-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 -m-2 rounded-lg hover:bg-dark-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-foam-100" />
          </Link>
          <h1 className="text-xl font-display font-bold beer-text flex items-center gap-2">
            <Info className="w-5 h-5 text-beer-400" />
            How to Play
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-900 rounded-2xl border border-dark-700 p-6 text-center"
        >
          <div className="w-20 h-20 rounded-2xl beer-gradient flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🍺</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-foam-100 mb-2">
            Welcome to NAPIWAS!
          </h2>
          <p className="text-foam-400">
            The ultimate beer-themed space shooter. Defend the brew, defeat the alcohol villains, 
            and become the champion of the leaderboard!
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-dark-900 rounded-xl border border-dark-700 p-4"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-beer-500/20 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-beer-400" />
                </div>
                <div>
                  <h3 className="font-bold text-foam-100 mb-1">{section.title}</h3>
                  <p className="text-sm text-foam-400 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Multiplier tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-dark-900 rounded-xl border border-dark-700 p-4"
        >
          <h3 className="font-bold text-foam-100 mb-3">NAPIWAS Token Tiers</h3>
          <div className="space-y-2">
            {[
              { tier: 'COMMON', balance: '0+', mult: '1.0x', color: '#9CA3AF' },
              { tier: 'UNCOMMON', balance: '1,000+', mult: '1.25x', color: '#22C55E' },
              { tier: 'RARE', balance: '10,000+', mult: '1.5x', color: '#3B82F6' },
              { tier: 'EPIC', balance: '50,000+', mult: '1.75x', color: '#A855F7' },
              { tier: 'LEGENDARY', balance: '100,000+', mult: '2.0x', color: '#FFD700' },
            ].map((item) => (
              <div
                key={item.tier}
                className="flex items-center justify-between p-2 rounded-lg bg-dark-800"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-foam-100">{item.tier}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-foam-500">{item.balance}</span>
                  <span className="font-bold" style={{ color: item.color }}>{item.mult}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Play button */}
        <Link
          href="/play"
          className="block w-full py-4 rounded-xl beer-gradient text-dark-950 font-bold text-center text-lg hover:brightness-110 transition-all"
        >
          Start Playing
        </Link>
      </div>
    </div>
  )
}

'use client'

import { useGameStore } from '@/lib/store'
import { Check, Lock, Skull } from 'lucide-react'
import { AppPageHeader } from '@/components/ui/app-page-header'

const BOSSES = [
  { id: 'nyan-cat', name: 'NYAN CAT', hp: 250, dmg: 10, reward: 500, color: '#FF6B9D' },
  { id: 'demon-cat', name: 'DEMON CAT', hp: 300, dmg: 14, reward: 750, color: '#FF4757' },
  { id: 'cyber-cat', name: 'CYBER CAT', hp: 360, dmg: 16, reward: 900, color: '#00D2D3' },
  { id: 'phantom-cat', name: 'PHANTOM CAT', hp: 420, dmg: 18, reward: 1100, color: '#A55EEA' },
  { id: 'gold-cat', name: 'GOLD CAT', hp: 500, dmg: 20, reward: 1300, color: '#F97316' },
  { id: 'galactic-cat', name: 'GALACTIC CAT', hp: 580, dmg: 22, reward: 1600, color: '#9D00FF' },
  { id: 'mega-grand-master', name: 'MEGA GRAND MASTER', hp: 650, dmg: 24, reward: 1900, color: '#FF1493' },
  { id: 'super-guitar-cat', name: 'SUPER GUITAR CAT', hp: 720, dmg: 26, reward: 2200, color: '#FF6B00' },
  { id: 'grand-piano-cat', name: 'GRAND PIANO CAT', hp: 820, dmg: 28, reward: 2600, color: '#FF4757' },
  { id: 'terminator', name: 'TERMINATOR', hp: 930, dmg: 30, reward: 3000, color: '#C0C0C0' },
  { id: 'joker-cat', name: 'JOKER CAT', hp: 1050, dmg: 32, reward: 3500, color: '#9400D3' },
]

export default function BossesPage() {
  const { bossesDefeated, language, theme } = useGameStore()
  const isDark = theme === 'dark'
  const defeatedCount = Math.min(bossesDefeated, BOSSES.length)

  const t =
    language === 'ru'
      ? {
          title: 'Р‘РѕСЃСЃС‹',
          subtitle: 'РџСЂРѕРіСЂРµСЃСЃ РїРѕ Р±РѕСЃСЃР°Рј Рё РЅР°РіСЂР°РґР°Рј',
          reward: 'РќР°РіСЂР°РґР°',
          unlocked: 'РћС‚РєСЂС‹С‚',
          defeated: 'РџРѕР±РµР¶РґС‘РЅ',
          locked: 'Р—Р°РєСЂС‹С‚',
          hp: 'HP',
          dmg: 'DMG',
        }
      : {
          title: 'Bosses',
          subtitle: 'Boss progression and rewards',
          reward: 'Reward',
          unlocked: 'Unlocked',
          defeated: 'Defeated',
          locked: 'Locked',
          hp: 'HP',
          dmg: 'DMG',
        }

  return (
    <div className={`min-h-screen pb-[calc(108px+env(safe-area-inset-bottom))] ${isDark ? 'bg-[#070707]' : 'bg-[#f7f4ec]'}`}>
      <AppPageHeader
        title={t.title}
        icon={<Skull className="h-5 w-5 text-orange-500" />}
        rightSlot={
          <div
            className={`flex h-10 items-center rounded-xl px-3 text-sm font-bold ${
              isDark ? 'border border-[#8a4e12]/70 bg-[#111111] text-orange-300' : 'border border-orange-300 bg-orange-50 text-orange-700'
            }`}
          >
            {defeatedCount}/{BOSSES.length}
          </div>
        }
      />

      <div className="space-y-3 px-4 pt-4">
        <div
          className={`rounded-2xl p-4 ${
            isDark ? 'border border-[#8a4e12]/65 bg-[#0f0f0f]' : 'border border-[#eadfca] bg-white'
          }`}
        >
          <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-white/55' : 'text-[#7a6a4b]'}`}>{t.subtitle}</p>
          <p className={`mt-2 text-sm font-semibold ${isDark ? 'text-white/90' : 'text-[#2a2417]'}`}>
            {t.defeated}: {defeatedCount}
          </p>
        </div>

        {BOSSES.map((boss, index) => {
          const defeated = index < defeatedCount
          const unlocked = index <= defeatedCount

          return (
            <div
              key={boss.id}
              className={`rounded-2xl border p-4 ${
                isDark ? 'border-[#8a4e12]/65 bg-[#101010]' : 'border-[#eadfca] bg-white'
              } ${!unlocked ? 'opacity-65' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                    isDark ? 'border-[#8a4e12]/70 bg-black/60' : 'border-[#e8dcc7] bg-[#fcf7ec]'
                  }`}
                  style={{
                    boxShadow: unlocked ? `0 0 14px ${boss.color}55` : undefined,
                  }}
                >
                  {unlocked ? <Skull className="h-6 w-6" style={{ color: boss.color }} /> : <Lock className="h-5 w-5 text-white/45" />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-bold ${isDark ? 'text-white' : 'text-[#1f1b12]'}`}>{boss.name}</p>
                  <p className={`mt-1 text-xs ${isDark ? 'text-white/60' : 'text-[#796a4a]'}`}>
                    {t.hp} {boss.hp} вЂў {t.dmg} {boss.dmg} вЂў {t.reward} {boss.reward} рџЌє
                  </p>
                </div>

                <div
                  className={`shrink-0 rounded-lg border px-2 py-1 text-[11px] font-semibold ${
                    defeated
                      ? isDark
                        ? 'border-emerald-500/45 bg-emerald-500/12 text-emerald-300'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : unlocked
                      ? isDark
                        ? 'border-orange-500/45 bg-orange-500/12 text-orange-300'
                        : 'border-orange-300 bg-orange-50 text-orange-700'
                      : isDark
                      ? 'border-white/15 bg-white/5 text-white/50'
                      : 'border-[#d9d0bd] bg-[#f4efe5] text-[#7a6f58]'
                  }`}
                >
                  {defeated ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      {t.defeated}
                    </span>
                  ) : unlocked ? (
                    t.unlocked
                  ) : (
                    t.locked
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

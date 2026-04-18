'use client'

import { 
  Info, Gamepad2, Target, Shield, Zap, 
  Trophy, Wallet, Flame, Music, Swords, Gift
} from 'lucide-react'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { AppPageHeader } from '@/components/ui/app-page-header'

export default function GuidePage() {
  const { theme, language } = useGameStore()
  const isDark = theme === 'dark'

  const t = {
    title: language === 'ru' ? 'РљР°Рє РёРіСЂР°С‚СЊ' : 'How to Play',
    welcome: language === 'ru' ? 'Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ РІ NAPIWAS!' : 'Welcome to NAPIWAS!',
    welcomeDesc: language === 'ru' 
      ? 'РљРѕСЃРјРёС‡РµСЃРєРёР№ С€СѓС‚РµСЂ СЃ РєРѕС‚РёРєРѕРј РїСЂРѕС‚РёРІ РїРёРІРЅС‹С… РєСЂСѓР¶РµРє. РџРѕР±РµР¶РґР°Р№ РІСЂР°РіРѕРІ, СЃРѕР±РёСЂР°Р№ Р±РѕРЅСѓСЃС‹ Рё СЃС‚Р°РЅСЊ С‡РµРјРїРёРѕРЅРѕРј!'
      : 'The ultimate cat vs beer space shooter. Defeat enemies, collect power-ups, and become the champion!',
    startPlaying: language === 'ru' ? 'РќР°С‡Р°С‚СЊ РёРіСЂР°С‚СЊ' : 'Start Playing',
    quickActions: language === 'ru' ? 'Р‘С‹СЃС‚СЂС‹Рµ РґРµР№СЃС‚РІРёСЏ' : 'Quick Actions',
  }

  const sections = language === 'ru' ? [
    {
      icon: Gamepad2,
      title: 'РЈРїСЂР°РІР»РµРЅРёРµ',
      content: 'РџСЂРѕРІРµРґРёС‚Рµ РїР°Р»СЊС†РµРј РІР»РµРІРѕ РёР»Рё РІРїСЂР°РІРѕ РґР»СЏ РїРµСЂРµРјРµС‰РµРЅРёСЏ РєРѕС‚РёРєР°. РљРѕСЂР°Р±Р»СЊ СЃС‚СЂРµР»СЏРµС‚ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё. РЈРєР»РѕРЅСЏР№С‚РµСЃСЊ РѕС‚ РїРёРІРЅС‹С… СЃРЅР°СЂСЏРґРѕРІ!',
    },
    {
      icon: Target,
      title: 'РћСЂСѓР¶РёРµ',
      content: 'РќР°С‡РЅРёС‚Рµ СЃ Р±Р°Р·РѕРІРѕР№ РїСѓС€РєРё. РћС‚РєСЂС‹РІР°Р№С‚Рµ РјРѕС‰РЅРѕРµ РѕСЂСѓР¶РёРµ РїРѕР±РµР¶РґР°СЏ Р±РѕСЃСЃРѕРІ РёР»Рё РїРѕРєСѓРїР°СЏ РІ РјР°РіР°Р·РёРЅРµ. 10 РІРёРґРѕРІ РѕСЂСѓР¶РёСЏ СЃ СѓРЅРёРєР°Р»СЊРЅС‹РјРё С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєР°РјРё!',
    },
    {
      icon: Shield,
      title: 'Р‘РѕРЅСѓСЃС‹',
      content: 'РЎРѕР±РёСЂР°Р№С‚Рµ Р±РѕРЅСѓСЃС‹ СЃ РїРѕР±РµР¶РґРµРЅРЅС‹С… РІСЂР°РіРѕРІ: Р©РёС‚ (Р±Р»РѕРєРёСЂСѓРµС‚ СѓСЂРѕРЅ), Р”РІРѕР№РЅРѕР№ РІС‹СЃС‚СЂРµР», РЎРєРѕСЂРѕСЃС‚СЂРµР»СЊРЅРѕСЃС‚СЊ, Р›РµС‡РµРЅРёРµ. Р‘РѕРЅСѓСЃС‹ СЃРєР»Р°РґС‹РІР°СЋС‚СЃСЏ!',
    },
    {
      icon: Trophy,
      title: 'РћС‡РєРё',
      content: 'РџРѕР±РµР¶РґР°Р№С‚Рµ РІСЂР°РіРѕРІ С‡С‚РѕР±С‹ Р·Р°СЂР°Р±РѕС‚Р°С‚СЊ РѕС‡РєРё. Р‘РѕР»СЊС€РёРµ РІСЂР°РіРё РґР°СЋС‚ Р±РѕР»СЊС€Рµ РѕС‡РєРѕРІ. Р—Р° Р±РѕСЃСЃРѕРІ РґР°СЋС‚ РѕРіСЂРѕРјРЅС‹Рµ Р±РѕРЅСѓСЃС‹. РњРЅРѕР¶РёС‚РµР»СЊ СѓРІРµР»РёС‡РёРІР°РµС‚ Р·Р°СЂР°Р±РѕС‚РѕРє!',
    },
    {
      icon: Wallet,
      title: 'РўРѕРєРµРЅС‹ NAPIWAS',
      content: 'РџРѕРґРєР»СЋС‡РёС‚Рµ TON РєРѕС€РµР»РµРє СЃ С‚РѕРєРµРЅР°РјРё NAPIWAS РґР»СЏ РјРЅРѕР¶РёС‚РµР»РµР№: 1000+ = 1.25x, 10000+ = 1.5x, 50000+ = 1.75x, 100000+ = 2.0x!',
    },
    {
      icon: Flame,
      title: 'Р•Р¶РµРґРЅРµРІРЅС‹Рµ РЅР°РіСЂР°РґС‹',
      content: 'Р—Р°С…РѕРґРёС‚Рµ РєР°Р¶РґС‹Р№ РґРµРЅСЊ РґР»СЏ Р±РѕРЅСѓСЃРЅС‹С… РѕС‡РєРѕРІ. РЎРѕР·РґР°РІР°Р№С‚Рµ СЃРµСЂРёСЋ РґР»СЏ Р±РѕР»СЊС€РёС… РЅР°РіСЂР°Рґ! Р’С‹РїРѕР»РЅСЏР№С‚Рµ Р·Р°РґР°РЅРёСЏ DEX РґР»СЏ РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹С… Р±РѕРЅСѓСЃРѕРІ.',
    },
    {
      icon: Swords,
      title: 'PvP Р‘РёС‚РІС‹',
      content: 'Р‘СЂРѕСЃСЊС‚Рµ РІС‹Р·РѕРІ РґСЂСѓРіРёРј РёРіСЂРѕРєР°Рј РІ Р±РёС‚РІРµ Р·Р° РѕС‡РєРё. РЎРѕР·РґР°Р№С‚Рµ РјР°С‚С‡ СЃРѕ СЃС‚Р°РІРєРѕР№ - РїРѕР±РµРґРёС‚РµР»СЊ Р·Р°Р±РёСЂР°РµС‚ РІСЃС‘ (РјРёРЅСѓСЃ 5% РєРѕРјРёСЃСЃРёРё).',
    },
    {
      icon: Music,
      title: 'РњСѓР·С‹РєР°',
      content: 'РћС‚РєСЂС‹РІР°Р№С‚Рµ РЅРѕРІС‹Рµ С‚СЂРµРєРё РґРѕСЃС‚РёРіР°СЏ РѕРїСЂРµРґРµР»РµРЅРЅРѕРіРѕ РєРѕР»РёС‡РµСЃС‚РІР° РѕС‡РєРѕРІ. РЎР»СѓС€Р°Р№С‚Рµ Р»СЋР±РёРјСѓСЋ РјСѓР·С‹РєСѓ РІРѕ РІСЂРµРјСЏ РёРіСЂС‹!',
    },
    {
      icon: Gift,
      title: 'Р‘РѕСЃСЃС‹',
      content: 'РљР°Р¶РґСѓСЋ РјРёРЅСѓС‚Сѓ РїРѕСЏРІР»СЏРµС‚СЃСЏ Р±РѕСЃСЃ-РєРѕС‚! РЎ РєР°Р¶РґС‹Рј СЂР°Р·РѕРј Р±РѕСЃСЃ СЃС‚Р°РЅРѕРІРёС‚СЃСЏ СЃРёР»СЊРЅРµРµ. Р—Р° РїРѕР±РµРґСѓ РЅР°Рґ Р±РѕСЃСЃРѕРј РјРѕР¶РЅРѕ РїРѕР»СѓС‡РёС‚СЊ РѕСЂСѓР¶РёРµ (С€Р°РЅСЃ 30%)!',
    },
  ] : [
    {
      icon: Gamepad2,
      title: 'Basic Controls',
      content: 'Slide your finger left and right to move your cat. The ship auto-fires at enemies. Avoid getting hit by beer projectiles!',
    },
    {
      icon: Target,
      title: 'Weapons',
      content: 'Start with basic yarn ball. Unlock powerful weapons by defeating bosses or buying in shop. 10 unique weapons with different stats!',
    },
    {
      icon: Shield,
      title: 'Power-Ups',
      content: 'Collect power-ups from defeated enemies: Shield (blocks damage), Double Shot, Speed Boost, Health packs. Power-ups can stack!',
    },
    {
      icon: Trophy,
      title: 'Scoring',
      content: 'Defeat enemies to earn points. Larger enemies give more points. Boss battles award massive bonuses. Multiplier boosts your earnings!',
    },
    {
      icon: Wallet,
      title: 'NAPIWAS Tokens',
      content: 'Connect your TON wallet with NAPIWAS tokens for multipliers: 1000+ = 1.25x, 10000+ = 1.5x, 50000+ = 1.75x, 100000+ = 2.0x!',
    },
    {
      icon: Flame,
      title: 'Daily Rewards',
      content: 'Check in daily to earn bonus points. Build a streak for bigger rewards! Complete DEX tasks for additional bonuses.',
    },
    {
      icon: Swords,
      title: 'PvP Battles',
      content: 'Challenge other players to score battles. Create a match with a bet - winner takes the pot (minus 5% house fee).',
    },
    {
      icon: Music,
      title: 'Jukebox',
      content: 'Unlock new music tracks by reaching score milestones. Listen to your favorite tracks while playing!',
    },
    {
      icon: Gift,
      title: 'Boss Rush',
      content: 'Every minute a boss cat appears! Each boss is stronger than the last. Defeat bosses for weapon drops (30% chance)!',
    },
  ]

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0b]' : 'bg-[#faf9f7]'}`}>
      <AppPageHeader
        title={t.title}
        icon={<Info className="w-5 h-5 text-orange-500" />}
      />

      <div className="p-4 space-y-4 pb-8">
        {/* Hero */}
        <div
          className={`rounded-2xl border p-6 text-center animate-fadeInUp ${
            isDark ? 'bg-[#111] border-[#1a1a1a]' : 'bg-white border-[#e5e5e5]'
          }`}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <span className="text-4xl">рџђ±</span>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
            {t.welcome}
          </h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.welcomeDesc}
          </p>

          <div className="mt-5">
            <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.12em] ${isDark ? 'text-orange-400/75' : 'text-orange-600'}`}>
              {t.quickActions}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/play"
                className={`rounded-xl border px-3 py-2 text-sm font-semibold backdrop-blur-lg transition-all active:scale-[0.98] ${
                  isDark ? 'border-orange-500/25 bg-black/45 text-white hover:border-orange-500/45' : 'border-orange-400/35 bg-white/80 text-[#2b2416]'
                }`}
              >
                {language === 'ru' ? 'РРіСЂР°С‚СЊ' : 'Play'}
              </Link>
              <Link
                href="/shop"
                className={`rounded-xl border px-3 py-2 text-sm font-semibold backdrop-blur-lg transition-all active:scale-[0.98] ${
                  isDark ? 'border-orange-500/25 bg-black/45 text-white hover:border-orange-500/45' : 'border-orange-400/35 bg-white/80 text-[#2b2416]'
                }`}
              >
                {language === 'ru' ? 'РњР°РіР°Р·РёРЅ' : 'Shop'}
              </Link>
              <Link
                href="/daily"
                className={`rounded-xl border px-3 py-2 text-sm font-semibold backdrop-blur-lg transition-all active:scale-[0.98] ${
                  isDark ? 'border-orange-500/25 bg-black/45 text-white hover:border-orange-500/45' : 'border-orange-400/35 bg-white/80 text-[#2b2416]'
                }`}
              >
                {language === 'ru' ? 'Р—Р°РґР°РЅРёСЏ' : 'Tasks'}
              </Link>
              <Link
                href="/music"
                className={`rounded-xl border px-3 py-2 text-sm font-semibold backdrop-blur-lg transition-all active:scale-[0.98] ${
                  isDark ? 'border-orange-500/25 bg-black/45 text-white hover:border-orange-500/45' : 'border-orange-400/35 bg-white/80 text-[#2b2416]'
                }`}
              >
                {language === 'ru' ? 'РњСѓР·С‹РєР°' : 'Music'}
              </Link>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className={`rounded-xl border p-4 animate-fadeInUp ${
                isDark ? 'bg-[#111] border-[#1a1a1a]' : 'bg-white border-[#e5e5e5]'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{section.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Multiplier tiers */}
        <div
          className={`rounded-xl border p-4 animate-fadeInUp ${
            isDark ? 'bg-[#111] border-[#1a1a1a]' : 'bg-white border-[#e5e5e5]'
          }`}
          style={{ animationDelay: '500ms' }}
        >
          <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
            {language === 'ru' ? 'РЈСЂРѕРІРЅРё С‚РѕРєРµРЅРѕРІ NAPIWAS' : 'NAPIWAS Token Tiers'}
          </h3>
          <div className="space-y-2">
            {[
              { tier: language === 'ru' ? 'РћР‘Р«Р§РќР«Р™' : 'COMMON', balance: '0+', mult: '1.0x', color: '#9CA3AF' },
              { tier: language === 'ru' ? 'РќР•РћР‘Р«Р§РќР«Р™' : 'UNCOMMON', balance: '1,000+', mult: '1.25x', color: '#22C55E' },
              { tier: language === 'ru' ? 'Р Р•Р”РљРР™' : 'RARE', balance: '10,000+', mult: '1.5x', color: '#3B82F6' },
              { tier: language === 'ru' ? 'Р­РџРР§Р•РЎРљРР™' : 'EPIC', balance: '50,000+', mult: '1.75x', color: '#A855F7' },
              { tier: language === 'ru' ? 'Р›Р•Р“Р•РќР”РђР РќР«Р™' : 'LEGENDARY', balance: '100,000+', mult: '2.0x', color: '#FFD700' },
            ].map((item) => (
              <div
                key={item.tier}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isDark ? 'bg-[#0a0a0b]' : 'bg-[#f5f5f5]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{item.tier}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>{item.balance}</span>
                  <span className="font-bold" style={{ color: item.color }}>{item.mult}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Play button */}
        <Link
          href="/play"
          className="block w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-black font-bold text-center text-lg active:scale-[0.98] transition-all shadow-lg shadow-orange-500/30"
        >
          {t.startPlaying}
        </Link>
      </div>
    </div>
  )
}

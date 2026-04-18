'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store'
import { formatNumber } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import {
  ShoppingBag,
  Cat,
  Zap,
  Crown,
  Beer,
  Crosshair,
  Sparkles,
  Flame,
  Orbit,
  Snowflake,
  Target,
} from 'lucide-react'
import { AppPageHeader } from '@/components/ui/app-page-header'

const weaponIcons: Record<string, LucideIcon> = {
  standard: Crosshair,
  spread: Target,
  laser: Zap,
  chainsaw: Orbit,
  missile: Flame,
  paw: Sparkles,
  beer: Beer,
  ice: Snowflake,
}

const skinIcons: Record<string, LucideIcon> = {
  orange_cat: Flame,
  gray_cat: Orbit,
  black_cat: Cat,
  white_cat: Snowflake,
  calico_cat: Sparkles,
  siamese_cat: Target,
  ginger_ninja: Crosshair,
  cosmic_cat: Zap,
  golden_emperor: Beer,
  napiwas_legend: Crown,
}

type DisplayWeaponStats = {
  damage: number
  shotsPerSecond: number
  projectiles: number
}

const displayWeaponStatsById: Record<string, DisplayWeaponStats> = {
  standard: { damage: 1, shotsPerSecond: 7.1, projectiles: 1 },
  spread: { damage: 1, shotsPerSecond: 3.8, projectiles: 3 },
  laser: { damage: 3, shotsPerSecond: 2.6, projectiles: 1 },
  chainsaw: { damage: 2, shotsPerSecond: 5.0, projectiles: 1 },
  missile: { damage: 4, shotsPerSecond: 2.2, projectiles: 1 },
  paw: { damage: 2, shotsPerSecond: 5.6, projectiles: 2 },
  beer: { damage: 3, shotsPerSecond: 1.0, projectiles: 1 },
  ice: { damage: 1, shotsPerSecond: 2.5, projectiles: 1 },
}

function WeaponGlyph({ weaponId, color, isDark }: { weaponId: string; color: string; isDark: boolean }) {
  const Icon = weaponIcons[weaponId] ?? Crosshair
  return (
    <div className="w-11 h-11 flex items-center justify-center">
      <Icon
        className="w-8 h-8"
        style={{
          color,
          filter: isDark
            ? 'saturate(1.45) brightness(1.3) drop-shadow(0 0 6px rgba(251,191,36,0.35))'
            : 'saturate(1.35) brightness(1.1)',
        }}
        strokeWidth={2.2}
      />
    </div>
  )
}

function SkinGlyph({ skinId, color, isDark }: { skinId: string; color: string; isDark: boolean }) {
  const Icon = skinIcons[skinId] ?? Cat
  return (
    <div className="w-11 h-11 flex items-center justify-center">
      <Icon
        className="w-8 h-8"
        style={{
          color,
          filter: isDark
            ? 'saturate(1.45) brightness(1.3) drop-shadow(0 0 6px rgba(251,191,36,0.35))'
            : 'saturate(1.35) brightness(1.1)',
        }}
        strokeWidth={2.2}
      />
    </div>
  )
}

export default function ShopPage() {
  const [tab, setTab] = useState<'skins' | 'weapons'>('skins')

  const {
    coins,
    skins,
    weapons,
    currentSkinId,
    currentWeaponIndex,
    purchaseSkin,
    purchaseWeapon,
    selectSkin,
    selectWeapon,
    theme,
    language,
  } = useGameStore()

  const t = {
    title: language === 'ru' ? 'РњР°РіР°Р·РёРЅ' : 'Shop',
    skins: language === 'ru' ? 'РЎРєРёРЅС‹' : 'Skins',
    weapons: language === 'ru' ? 'РћСЂСѓР¶РёРµ' : 'Weapons',
    select: language === 'ru' ? 'Р’С‹Р±СЂР°С‚СЊ' : 'Select',
    selected: language === 'ru' ? 'Р’С‹Р±СЂР°РЅ' : 'Selected',
    active: language === 'ru' ? 'РђРєС‚РёРІРЅРѕ' : 'Active',
    damage: language === 'ru' ? 'РЈСЂРѕРЅ' : 'DMG',
    rate: language === 'ru' ? 'РЎРєРѕСЂ.' : 'Rate',
    projectiles: language === 'ru' ? 'РЎРЅР°СЂ.' : 'Proj',
    purchasesHint: language === 'ru' ? 'РџРѕРєСѓРїРєРё Р·Р° РїРёРІРЅС‹Рµ РєСЂСѓР¶РєРё' : 'Purchases use beer mugs',
  }

  const rarityLabels: Record<string, { en: string; ru: string }> = {
    common: { en: 'Common', ru: 'РћР±С‹С‡РЅС‹Р№' },
    uncommon: { en: 'Uncommon', ru: 'РќРµРѕР±С‹С‡РЅС‹Р№' },
    rare: { en: 'Rare', ru: 'Р РµРґРєРёР№' },
    epic: { en: 'Epic', ru: 'Р­РїРёРє' },
    legendary: { en: 'Legendary', ru: 'Р›РµРіРµРЅРґР°' },
  }

  const isDark = theme === 'dark'

  const handlePurchaseSkin = (skinId: string) => {
    if (purchaseSkin(skinId)) {
      selectSkin(skinId)
    }
  }

  const handlePurchaseWeapon = (weaponId: string, index: number) => {
    if (purchaseWeapon(weaponId)) {
      selectWeapon(index)
    }
  }

  const onSkinCardPress = (skinId: string, skinUnlocked: boolean, canAfford: boolean) => {
    if (skinUnlocked) {
      selectSkin(skinId)
      return
    }
    if (canAfford) {
      handlePurchaseSkin(skinId)
    }
  }

  const onWeaponCardPress = (weaponId: string, index: number, weaponUnlocked: boolean, canAfford: boolean) => {
    if (weaponUnlocked) {
      selectWeapon(index)
      return
    }
    if (canAfford) {
      handlePurchaseWeapon(weaponId, index)
    }
  }

  return (
    <div className={`h-[100dvh] overflow-x-hidden overflow-y-auto overscroll-y-contain pb-[calc(72px+env(safe-area-inset-bottom))] ${isDark ? 'bg-[#0a0a0b]' : 'bg-[#faf9f7]'}`}>
      <AppPageHeader
        title={t.title}
        icon={<ShoppingBag className="w-5 h-5 text-orange-500" />}
        rightSlot={
          <div
            className={`h-10 px-3 rounded-xl flex items-center gap-1.5 ${isDark ? 'bg-[#1d1d1d]' : 'bg-[#e7e7e7]'}`}
          >
            <Beer className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-orange-500">{formatNumber(coins)}</span>
          </div>
        }
      />

      <div className="px-4 pt-3">
        <div className="rounded-2xl p-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTab('skins')}
              className={`h-11 rounded-xl font-semibold transition-all ${
                tab === 'skins'
                  ? 'menu-play-button text-[#1a1a1a]'
                  : isDark
                    ? 'bg-[#0f0f11] text-white/80'
                    : 'bg-[#f0e8d9] text-[#2f2617]'
              }`}
              role="tab"
              aria-selected={tab === 'skins'}
            >
              {t.skins}
            </button>
            <button
              onClick={() => setTab('weapons')}
              className={`h-11 rounded-xl font-semibold transition-all ${
                tab === 'weapons'
                  ? 'menu-play-button text-[#1a1a1a]'
                  : isDark
                    ? 'bg-[#0f0f11] text-white/80'
                    : 'bg-[#f0e8d9] text-[#2f2617]'
              }`}
              role="tab"
              aria-selected={tab === 'weapons'}
            >
              {t.weapons}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 pt-4 space-y-3">
        {tab === 'skins' ? (
          <>
            {skins.map((skin, index) => {
              const isSelected = currentSkinId === skin.id
              const canAfford = coins >= skin.price
              return (
                <div
                  key={skin.id}
                  onClick={() => onSkinCardPress(skin.id, skin.unlocked, canAfford)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSkinCardPress(skin.id, skin.unlocked, canAfford)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className={`p-4 rounded-2xl transition-all animate-fadeInUp ${
                    isSelected
                      ? isDark
                        ? 'bg-[#2a2318]'
                        : 'bg-[#e5d8c1]'
                      : isDark
                        ? 'bg-[#161616]'
                        : 'bg-[#ececec]'
                  } cursor-pointer outline-none`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <SkinGlyph skinId={skin.id} color={skin.color} isDark={isDark} />
                      <span
                        className="absolute -top-0.5 -right-0.5 text-[8px] px-1.5 py-0.5 rounded-bl-lg rounded-tr-xl font-bold text-white uppercase"
                        style={{ backgroundColor: isSelected ? '#F59E0B' : '#8A4E12' }}
                      >
                        {language === 'ru' ? rarityLabels[skin.rarity].ru.slice(0, 3) : rarityLabels[skin.rarity].en.slice(0, 3)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                          {language === 'ru' ? skin.nameRu : skin.name}
                        </h3>
                        {isSelected && <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wide">{t.selected}</span>}
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {language === 'ru' ? skin.descriptionRu : skin.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-orange-500' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {skin.unlocked ? (isSelected ? t.selected : t.select) : `${formatNumber(skin.price)} ${language === 'ru' ? 'РєСЂСѓР¶РµРє' : 'mugs'}`}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <>
            {weapons.map((weapon, index) => {
              const isSelected = currentWeaponIndex === index
              const canAfford = coins >= weapon.price
              const displayStats = displayWeaponStatsById[weapon.id] ?? {
                damage: weapon.damage,
                shotsPerSecond: weapon.fireRate,
                projectiles: weapon.projectileCount,
              }

              return (
                <div
                  key={weapon.id}
                  onClick={() => onWeaponCardPress(weapon.id, index, weapon.unlocked, canAfford)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onWeaponCardPress(weapon.id, index, weapon.unlocked, canAfford)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className={`p-4 rounded-2xl transition-all animate-fadeInUp ${
                    isSelected
                      ? isDark
                        ? 'bg-[#2a2318]'
                        : 'bg-[#e5d8c1]'
                      : isDark
                        ? 'bg-[#161616]'
                        : 'bg-[#ececec]'
                  } cursor-pointer outline-none`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <WeaponGlyph weaponId={weapon.id} color={weapon.color} isDark={isDark} />
                      <span
                        className="absolute -top-0.5 -right-0.5 text-[8px] px-1.5 py-0.5 rounded-bl-lg rounded-tr-xl font-bold text-white uppercase"
                        style={{ backgroundColor: isSelected ? '#F59E0B' : '#8A4E12' }}
                      >
                        {language === 'ru' ? rarityLabels[weapon.rarity].ru.slice(0, 3) : rarityLabels[weapon.rarity].en.slice(0, 3)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                          {language === 'ru' ? weapon.nameRu : weapon.name}
                        </h3>
                        {isSelected && weapon.unlocked && <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wide">{t.active}</span>}
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {language === 'ru' ? weapon.descriptionRu : weapon.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-[10px] mt-1.5 font-medium text-orange-400">
                        <span>{t.damage}: {displayStats.damage}</span>
                        <span>{t.rate}: {displayStats.shotsPerSecond.toFixed(1)}/s</span>
                        <span>{t.projectiles}: {displayStats.projectiles}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-orange-500' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {weapon.unlocked ? (isSelected ? t.active : t.select) : `${formatNumber(weapon.price)} ${language === 'ru' ? 'РєСЂСѓР¶РµРє' : 'mugs'}`}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      <div className="px-4 pb-3">
        <p className={`text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.purchasesHint}</p>
      </div>
      <div aria-hidden className="h-24" />
    </div>
  )
}

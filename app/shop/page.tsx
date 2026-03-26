'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store'
import { formatNumber } from '@/lib/utils'
import { ArrowLeft, ShoppingBag, Cat, Zap, Check, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ShopPage() {
  const [tab, setTab] = useState<'skins' | 'weapons'>('skins')
  const { 
    coins, skins, weapons, currentSkinId,
    purchaseSkin, purchaseWeapon, selectSkin, selectWeapon,
    theme, language
  } = useGameStore()

  const t = {
    title: language === 'ru' ? 'Магазин' : 'Shop',
    skins: language === 'ru' ? 'Скины' : 'Skins',
    weapons: language === 'ru' ? 'Оружие' : 'Weapons',
    select: language === 'ru' ? 'Выбрать' : 'Select',
    selected: language === 'ru' ? 'Выбран' : 'Selected',
    active: language === 'ru' ? 'Активно' : 'Active',
    buy: language === 'ru' ? 'Купить' : 'Buy',
    locked: language === 'ru' ? 'Заблокировано' : 'Locked',
    damage: language === 'ru' ? 'Урон' : 'DMG',
    rate: language === 'ru' ? 'Скор.' : 'Rate',
    projectiles: language === 'ru' ? 'Снаряды' : 'Proj',
    earnCoins: language === 'ru' ? 'Зарабатывай монеты играя и побеждая боссов!' : 'Earn coins by playing and defeating bosses!',
    coins: language === 'ru' ? 'монет' : 'coins',
  }

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

  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-[#0a0a0b]' : 'bg-[#fefefe]'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-md border-b px-4 pt-[env(safe-area-inset-top)] pb-3 ${
        isDark ? 'bg-[#0a0a0b]/95 border-[#222]' : 'bg-[#fefefe]/95 border-[#e5e5e5]'
      }`}>
        <div className="flex items-center justify-between gap-3 pt-3">
          <Link 
            href="/" 
            className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-transform ${
              isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />
          </Link>
          
          <h1 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            {t.title}
          </h1>
          
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${
            isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]'
          }`}>
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-amber-500">{formatNumber(coins)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setTab('skins')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all active:scale-[0.98] ${
              tab === 'skins'
                ? 'bg-amber-500 text-black'
                : isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-[#f0f0f0] text-gray-600'
            }`}
          >
            <Cat className="w-4 h-4" />
            {t.skins}
          </button>
          <button
            onClick={() => setTab('weapons')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all active:scale-[0.98] ${
              tab === 'weapons'
                ? 'bg-amber-500 text-black'
                : isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-[#f0f0f0] text-gray-600'
            }`}
          >
            <Zap className="w-4 h-4" />
            {t.weapons}
          </button>
        </div>
      </header>

      <div className="p-4 space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {tab === 'skins' ? (
          <>
            {skins.map((skin, index) => {
              const isSelected = currentSkinId === skin.id
              const canAfford = coins >= skin.price

              return (
                <div
                  key={skin.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/30'
                      : isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5e5]'
                  }`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.3s ease forwards',
                    opacity: 0
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: skin.color + '20' }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full shadow-lg"
                        style={{ 
                          backgroundColor: skin.color,
                          boxShadow: `0 4px 15px ${skin.color}40`
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                          {language === 'ru' ? skin.nameRu : skin.name}
                        </h3>
                        {isSelected && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-medium">
                            {t.selected}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {skin.description}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {skin.unlocked ? (
                        isSelected ? (
                          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-black" />
                          </div>
                        ) : (
                          <button
                            onClick={() => selectSkin(skin.id)}
                            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm active:scale-95 transition-transform"
                          >
                            {t.select}
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handlePurchaseSkin(skin.id)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 active:scale-95 transition-transform ${
                            canAfford
                              ? 'bg-amber-500 text-black'
                              : isDark ? 'bg-[#222] text-gray-600' : 'bg-[#e5e5e5] text-gray-400'
                          }`}
                        >
                          {canAfford ? (
                            <>
                              <Sparkles className="w-4 h-4" />
                              {skin.price}
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              {skin.price}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <>
            {weapons.map((weapon, index) => {
              const isSelected = weapon.selected
              const canAfford = coins >= weapon.price

              return (
                <div
                  key={weapon.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/30'
                      : isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5e5]'
                  }`}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.3s ease forwards',
                    opacity: 0
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-8 h-8 text-amber-500" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                          {language === 'ru' ? weapon.nameRu : weapon.name}
                        </h3>
                        {isSelected && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-medium">
                            {t.active}
                          </span>
                        )}
                      </div>
                      <div className={`flex gap-3 text-xs mt-1 flex-wrap ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>{t.damage}: <strong>{weapon.damage}</strong></span>
                        <span>{t.rate}: <strong>{weapon.fireRate}/s</strong></span>
                        <span>{t.projectiles}: <strong>{weapon.projectileCount}</strong></span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {weapon.unlocked ? (
                        isSelected ? (
                          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-black" />
                          </div>
                        ) : (
                          <button
                            onClick={() => selectWeapon(index)}
                            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm active:scale-95 transition-transform"
                          >
                            {t.select}
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handlePurchaseWeapon(weapon.id, index)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 active:scale-95 transition-transform ${
                            canAfford
                              ? 'bg-amber-500 text-black'
                              : isDark ? 'bg-[#222] text-gray-600' : 'bg-[#e5e5e5] text-gray-400'
                          }`}
                        >
                          {canAfford ? (
                            <>
                              <Sparkles className="w-4 h-4" />
                              {weapon.price}
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              {weapon.price}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* Info Card */}
        <div className={`p-4 rounded-2xl text-center ${
          isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
        }`}>
          <p className={`text-sm ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>
            {t.earnCoins}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

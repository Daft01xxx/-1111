'use client'

import { useState, useEffect } from 'react'
import { useGameStore, NAPIWAS_CONTRACT } from '@/lib/store'
import { formatNumber } from '@/lib/utils'
import { ArrowLeft, ShoppingBag, Cat, Zap, Check, Lock, Coins, Wallet, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useTonWallet, useTonAddress } from '@tonconnect/ui-react'

export default function ShopPage() {
  const [tab, setTab] = useState<'skins' | 'weapons'>('skins')
  const [isLoading, setIsLoading] = useState(true)
  const wallet = useTonWallet()
  const address = useTonAddress()
  
  const { 
    napiwasBalance, skins, weapons, currentSkinId, currentWeaponIndex,
    purchaseSkin, purchaseWeapon, selectSkin, selectWeapon, setWallet,
    theme, language, walletAddress
  } = useGameStore()

  // Fetch NAPIWAS token balance when wallet connects
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) {
        setWallet(null, 0)
        setIsLoading(false)
        return
      }

      setWallet(address, napiwasBalance)
      
      // In production, fetch actual token balance from TON API
      // For demo, we'll use local state
      setIsLoading(false)
    }

    fetchBalance()
  }, [address, setWallet, napiwasBalance])

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
    connectWallet: language === 'ru' ? 'Подключите кошелек для покупок' : 'Connect wallet to purchase',
    napiwasInfo: language === 'ru' ? 'Покупки за токены NAPIWAS' : 'Purchase with NAPIWAS tokens',
    viewContract: language === 'ru' ? 'Смотреть контракт' : 'View Contract',
    balance: language === 'ru' ? 'Баланс' : 'Balance',
  }

  const rarityLabels: Record<string, { en: string; ru: string }> = {
    common: { en: 'Common', ru: 'Обычный' },
    uncommon: { en: 'Uncommon', ru: 'Необычный' },
    rare: { en: 'Rare', ru: 'Редкий' },
    epic: { en: 'Epic', ru: 'Эпический' },
    legendary: { en: 'Legendary', ru: 'Легендарный' },
  }

  const rarityColors: Record<string, string> = {
    common: '#6B7280',
    uncommon: '#22C55E',
    rare: '#3B82F6',
    epic: '#A855F7',
    legendary: '#F59E0B',
  }

  const handlePurchaseSkin = (skinId: string) => {
    if (!walletAddress) return
    if (purchaseSkin(skinId)) {
      selectSkin(skinId)
    }
  }

  const handlePurchaseWeapon = (weaponId: string, index: number) => {
    if (!walletAddress) return
    if (purchaseWeapon(weaponId)) {
      selectWeapon(index)
    }
  }

  const isDark = theme === 'dark'

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-[#0a0a0b]' : 'bg-[#faf9f7]'}`}>
      {/* Header */}
      <header 
        className={`sticky top-0 z-20 backdrop-blur-md border-b pt-[env(safe-area-inset-top)] ${
          isDark ? 'bg-[#0a0a0b]/95 border-[#1a1a1a]' : 'bg-[#faf9f7]/95 border-[#e5e5e5]'
        }`}
        style={{ animation: 'fadeInDown 0.3s ease' }}
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-3">
          <Link 
            href="/" 
            className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
              isDark ? 'bg-[#1a1a1a] hover:bg-[#252525]' : 'bg-[#f0f0f0] hover:bg-[#e5e5e5]'
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />
          </Link>
          
          <h1 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-black'}`}>
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            {t.title}
          </h1>
          
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${
            isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0f0]'
          }`}>
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-amber-500">{formatNumber(napiwasBalance)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 pb-3">
          <button
            onClick={() => setTab('skins')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all active:scale-[0.98] ${
              tab === 'skins'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-[#f0f0f0] text-gray-600'
            }`}
          >
            <Cat className="w-4 h-4" />
            {t.skins} ({skins.filter(s => s.unlocked).length}/{skins.length})
          </button>
          <button
            onClick={() => setTab('weapons')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all active:scale-[0.98] ${
              tab === 'weapons'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                : isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-[#f0f0f0] text-gray-600'
            }`}
          >
            <Zap className="w-4 h-4" />
            {t.weapons} ({weapons.filter(w => w.unlocked).length}/{weapons.length})
          </button>
        </div>
      </header>

      <div className="p-4 space-y-3 pb-32">
        {tab === 'skins' ? (
          <>
            {skins.map((skin, index) => {
              const isSelected = currentSkinId === skin.id
              const canAfford = napiwasBalance >= skin.price

              return (
                <div
                  key={skin.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                      : isDark ? 'bg-[#111] border-[#1a1a1a]' : 'bg-white border-[#e5e5e5]'
                  }`}
                  style={{ 
                    borderColor: isSelected ? '#F59E0B' : skin.unlocked ? rarityColors[skin.rarity] + '40' : undefined,
                    animation: `fadeInUp 0.4s ease ${index * 50}ms forwards`,
                    opacity: 0
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                      style={{ backgroundColor: skin.color + '15' }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full transition-transform hover:scale-110"
                        style={{ 
                          backgroundColor: skin.color,
                          boxShadow: `0 4px 20px ${skin.color}50`
                        }}
                      />
                      {/* Rarity badge */}
                      <span 
                        className="absolute -top-0.5 -right-0.5 text-[8px] px-1.5 py-0.5 rounded-bl-lg rounded-tr-xl font-bold text-white uppercase"
                        style={{ backgroundColor: rarityColors[skin.rarity] }}
                      >
                        {language === 'ru' ? rarityLabels[skin.rarity].ru.slice(0, 3) : rarityLabels[skin.rarity].en.slice(0, 3)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                          {language === 'ru' ? skin.nameRu : skin.name}
                        </h3>
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold uppercase tracking-wide">
                            {t.selected}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {language === 'ru' ? skin.descriptionRu : skin.description}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {skin.unlocked ? (
                        isSelected ? (
                          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <Check className="w-5 h-5 text-black" />
                          </div>
                        ) : (
                          <button
                            onClick={() => selectSkin(skin.id)}
                            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm active:scale-95 transition-all shadow-lg shadow-amber-500/25"
                          >
                            {t.select}
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handlePurchaseSkin(skin.id)}
                          disabled={!canAfford || !walletAddress}
                          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 active:scale-95 transition-all ${
                            canAfford && walletAddress
                              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                              : isDark ? 'bg-[#1a1a1a] text-gray-600' : 'bg-[#e5e5e5] text-gray-400'
                          }`}
                        >
                          {canAfford && walletAddress ? (
                            <>
                              <Coins className="w-3.5 h-3.5" />
                              {formatNumber(skin.price)}
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              {formatNumber(skin.price)}
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
              const isSelected = currentWeaponIndex === index
              const canAfford = napiwasBalance >= weapon.price

              return (
                <div
                  key={weapon.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                      : isDark ? 'bg-[#111] border-[#1a1a1a]' : 'bg-white border-[#e5e5e5]'
                  }`}
                  style={{ 
                    borderColor: isSelected ? '#F59E0B' : weapon.unlocked ? rarityColors[weapon.rarity] + '40' : undefined,
                    animation: `fadeInUp 0.4s ease ${index * 50}ms forwards`,
                    opacity: 0
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                      style={{ backgroundColor: weapon.color + '15' }}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg transition-transform hover:scale-110 hover:rotate-12"
                        style={{ 
                          backgroundColor: weapon.color,
                          boxShadow: `0 4px 15px ${weapon.color}40`
                        }}
                      />
                      {/* Rarity badge */}
                      <span 
                        className="absolute -top-0.5 -right-0.5 text-[8px] px-1.5 py-0.5 rounded-bl-lg rounded-tr-xl font-bold text-white uppercase"
                        style={{ backgroundColor: rarityColors[weapon.rarity] }}
                      >
                        {language === 'ru' ? rarityLabels[weapon.rarity].ru.slice(0, 3) : rarityLabels[weapon.rarity].en.slice(0, 3)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                          {language === 'ru' ? weapon.nameRu : weapon.name}
                        </h3>
                        {isSelected && weapon.unlocked && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold uppercase tracking-wide">
                            {t.active}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {language === 'ru' ? weapon.descriptionRu : weapon.description}
                      </p>
                      <div className="flex gap-3 text-[10px] mt-1.5 font-medium">
                        <span className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">{t.damage}: {weapon.damage}</span>
                        <span className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">{t.rate}: {weapon.fireRate}/s</span>
                        <span className="text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{t.projectiles}: {weapon.projectileCount}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {weapon.unlocked ? (
                        isSelected ? (
                          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <Check className="w-5 h-5 text-black" />
                          </div>
                        ) : (
                          <button
                            onClick={() => selectWeapon(index)}
                            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm active:scale-95 transition-all shadow-lg shadow-amber-500/25"
                          >
                            {t.select}
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handlePurchaseWeapon(weapon.id, index)}
                          disabled={!canAfford || !walletAddress}
                          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 active:scale-95 transition-all ${
                            canAfford && walletAddress
                              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
                              : isDark ? 'bg-[#1a1a1a] text-gray-600' : 'bg-[#e5e5e5] text-gray-400'
                          }`}
                        >
                          {canAfford && walletAddress ? (
                            <>
                              <Coins className="w-3.5 h-3.5" />
                              {formatNumber(weapon.price)}
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              {formatNumber(weapon.price)}
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
      </div>

      {/* Footer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 p-4 border-t pb-[calc(1rem+env(safe-area-inset-bottom))] ${
          isDark ? 'bg-[#0a0a0b]/95 backdrop-blur-md border-[#1a1a1a]' : 'bg-white/95 backdrop-blur-md border-[#e5e5e5]'
        }`}
      >
        {!walletAddress ? (
          <div className="flex items-center justify-center gap-2 text-amber-500">
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-medium">{t.connectWallet}</span>
          </div>
        ) : (
          <div className="text-center">
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {t.napiwasInfo}
            </p>
            <a 
              href={`https://tonviewer.com/${NAPIWAS_CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-500 text-[10px] font-mono mt-1 hover:underline"
            >
              CA: {NAPIWAS_CONTRACT.slice(0, 8)}...{NAPIWAS_CONTRACT.slice(-6)}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

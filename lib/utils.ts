import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function getMultiplierTier(napiwasBalance: number): { tier: string; multiplier: number; color: string } {
  if (napiwasBalance >= 100000) return { tier: 'LEGENDARY', multiplier: 2.0, color: '#FFD700' }
  if (napiwasBalance >= 50000) return { tier: 'EPIC', multiplier: 1.75, color: '#A855F7' }
  if (napiwasBalance >= 10000) return { tier: 'RARE', multiplier: 1.5, color: '#3B82F6' }
  if (napiwasBalance >= 1000) return { tier: 'UNCOMMON', multiplier: 1.25, color: '#22C55E' }
  return { tier: 'COMMON', multiplier: 1.0, color: '#9CA3AF' }
}

export function calculateBonusPoints(basePoints: number, multiplier: number): number {
  return Math.floor(basePoints * multiplier)
}

export function shortWalletAddress(address: string | null | undefined, head = 6, tail = 4): string {
  if (!address) return '-'
  const normalized = address.trim()
  if (normalized.length <= head + tail + 3) return normalized
  return `${normalized.slice(0, head)}...${normalized.slice(-tail)}`
}

'use client'

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { ReactNode, useMemo } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const manifestUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return 'https://v0-napiwasgame.vercel.app/tonconnect-manifest.json'
    }

    return `${window.location.origin}/tonconnect-manifest.json`
  }, [])

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  )
}

'use client'

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { ReactNode } from 'react'

const manifestUrl = 'https://napiwas.vercel.app/tonconnect-manifest.json'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  )
}

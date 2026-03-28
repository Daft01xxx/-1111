import type { Metadata, Viewport } from 'next'
import { Inter, Russo_One } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const russo = Russo_One({ 
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-russo',
})

export const metadata: Metadata = {
  title: 'Cosmic Cats - Alien Cat Boss Shooter',
  description: 'Battle alien cat bosses as a cute orange cat in this fast-paced space shooter! Earn coins, unlock skins, and climb the leaderboard!',
  keywords: ['game', 'cats', 'shooter', 'alien', 'space', 'arcade'],
  authors: [{ name: 'Cosmic Cats Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#fb923c',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${russo.variable}`}>
      <body className="min-h-screen bg-dark-950 text-foam-100 font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

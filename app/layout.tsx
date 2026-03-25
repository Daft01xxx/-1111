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
  title: 'NAPIWAS - Beer Space Shooter',
  description: 'The ultimate beer-themed space shooter game with TON wallet integration. Shoot foam, defeat bosses, and climb the leaderboard!',
  keywords: ['game', 'TON', 'NAPIWAS', 'crypto', 'shooter', 'beer'],
  authors: [{ name: 'NAPIWAS Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f98407',
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

import type { Metadata, Viewport } from 'next'
import { Inter, Russo_One } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { AppBottomNav } from '@/components/ui/app-bottom-nav'

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
  title: 'NAPIWAS - Cat vs Beer',
  description: 'The ultimate beer-themed shooter game with TON wallet integration',
  keywords: ['game', 'TON', 'NAPIWAS', 'crypto', 'shooter', 'beer', 'cat'],
  authors: [{ name: 'NAPIWAS Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#D4AF37',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${russo.variable}`}>
      <body className="relative min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))] font-sans antialiased">
        <Providers>
          <div className="relative z-10">
            {children}
            <AppBottomNav />
          </div>
        </Providers>
      </body>
    </html>
  )
}

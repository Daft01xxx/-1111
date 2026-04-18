import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface AppPageHeaderProps {
  title: ReactNode
  icon?: ReactNode
  rightSlot?: ReactNode
  backHref?: string
}

export function AppPageHeader({ title, icon, rightSlot, backHref = '/' }: AppPageHeaderProps) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-[calc(env(safe-area-inset-top)+10px)] pb-2 pointer-events-none">
        <div className="pointer-events-auto rounded-2xl border border-amber-400/30 bg-[rgb(var(--card))]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[rgb(var(--card))]/80 px-2 py-1.5">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={backHref}
              className="h-10 w-10 shrink-0 text-foreground/90 transition-colors hover:text-foreground active:text-foreground/80 active:opacity-80 flex items-center justify-center rounded-xl"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <h1 className="min-w-0 flex items-center gap-2 text-lg font-bold text-foreground">
              {icon}
              <span className="truncate">{title}</span>
            </h1>

            <div className="shrink-0">{rightSlot ?? <div className="h-10 w-10" />}</div>
          </div>
        </div>
      </header>
      <div aria-hidden className="h-[calc(env(safe-area-inset-top)+76px)] shrink-0" />
    </>
  )
}

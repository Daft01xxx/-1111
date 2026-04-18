'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{
        opacity: 0,
        x: 0,
        clipPath: 'inset(0 10% 0 0 round 12px)',
      }}
      animate={{
        opacity: 1,
        x: 0,
        clipPath: 'inset(0 0% 0 0 round 12px)',
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Handshake, ExternalLink, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { AppPageHeader } from '@/components/ui/app-page-header'

interface Partner {
  id: string
  name: string
  logo_url: string
  website_url: string
  description: string
  sort_order: number
  is_active: boolean
  is_featured: boolean
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useGameStore()

  const t = {
    title: language === 'ru' ? 'Партнеры' : 'Partners',
    subtitle: language === 'ru' ? 'Наши партнеры' : 'Our Amazing Partners',
    description: language === 'ru' 
      ? 'NAPIWAS существует благодаря этим невероятным проектам.' 
      : 'NAPIWAS is made possible thanks to these incredible projects.',
    featured: language === 'ru' ? 'Главные' : 'Featured',
    become: language === 'ru' ? 'Стать партнером' : 'Become a Partner',
    becomeDesc: language === 'ru' 
      ? 'Хотите сотрудничать с NAPIWAS? Мы всегда открыты!' 
      : 'Want to partner with NAPIWAS? We are always looking for exciting collaborations!',
    contact: language === 'ru' ? 'Связаться' : 'Contact Us',
  }

  useEffect(() => {
    const fetchPartners = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data) setPartners(data)
      setLoading(false)
    }

    fetchPartners()
  }, [])

  // Default partners if none in database
  const defaultPartners: Partner[] = [
    {
      id: 'v0',
      name: 'v0 by Vercel',
      logo_url: '',
      website_url: 'https://v0.dev',
      description: language === 'ru' ? 'AI-платформа разработки, создавшая эту игру.' : 'AI-powered development platform that helped build this game.',
      sort_order: 0,
      is_active: true,
      is_featured: true,
    },
    {
      id: 'ton',
      name: 'TON Blockchain',
      logo_url: '',
      website_url: 'https://ton.org',
      description: language === 'ru' ? 'The Open Network - быстрый, безопасный, децентрализованный.' : 'The Open Network - fast, secure, and decentralized.',
      sort_order: 1,
      is_active: true,
      is_featured: true,
    },
  ]

  const displayPartners = partners.length > 0 ? partners : defaultPartners
  const featuredPartners = displayPartners.filter(p => p.is_featured)
  const otherPartners = displayPartners.filter(p => !p.is_featured)

  return (
    <div className="min-h-screen bg-background">
      <AppPageHeader
        title={t.title}
        icon={<Handshake className="w-5 h-5 text-beer-400" />}
      />

      <div className="p-4 space-y-4">
        {/* Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-4 text-center"
        >
          <Sparkles className="w-10 h-10 text-beer-400 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-foreground mb-1">{t.subtitle}</h2>
          <p className="text-sm text-muted-foreground">{t.description}</p>
        </motion.div>

        {/* Partners grid */}
        {loading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Featured Partners */}
            {featuredPartners.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {t.featured}
                </h3>
                {featuredPartners.map((partner, index) => (
                  <motion.a
                    key={partner.id}
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                    className="block bg-gradient-to-r from-beer-500/10 to-amber-500/10 rounded-xl border border-beer-500/30 p-4 hover:border-beer-500/50 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {partner.logo_url ? (
                          <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold beer-text">{partner.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground group-hover:text-beer-400 transition-colors">{partner.name}</h3>
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{partner.description}</p>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}

            {/* Other Partners */}
            {otherPartners.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {otherPartners.map((partner, index) => (
                  <motion.a
                    key={partner.id}
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block bg-card rounded-xl border border-border p-3 hover:border-beer-500/50 transition-all text-center"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted mx-auto flex items-center justify-center overflow-hidden mb-2">
                      {partner.logo_url ? (
                        <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold beer-text">{partner.name.charAt(0)}</span>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground text-sm truncate">{partner.name}</h3>
                  </motion.a>
                ))}
              </div>
            )}
          </>
        )}

        {/* Become a partner CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-beer-500/20 to-beer-600/20 rounded-xl border border-beer-500/30 p-6 text-center"
        >
          <h3 className="text-lg font-bold text-foreground mb-2">{t.become}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t.becomeDesc}</p>
          <motion.a
            whileTap={{ scale: 0.95 }}
            href="https://t.me/napiwas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl beer-gradient text-dark-950 font-bold hover:brightness-110 transition-all"
          >
            {t.contact}
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}

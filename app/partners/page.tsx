'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Handshake, ExternalLink, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Partner {
  id: string
  name: string
  logo_url: string
  website_url: string
  description: string
  order_index: number
  is_active: boolean
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

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
      description: 'AI-powered development platform that helped build this game.',
      order_index: 0,
      is_active: true,
    },
    {
      id: 'ton',
      name: 'TON Blockchain',
      logo_url: '',
      website_url: 'https://ton.org',
      description: 'The Open Network - fast, secure, and decentralized.',
      order_index: 1,
      is_active: true,
    },
  ]

  const displayPartners = partners.length > 0 ? partners : defaultPartners

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-dark-950/90 backdrop-blur-sm border-b border-dark-800 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 -m-2 rounded-lg hover:bg-dark-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-foam-100" />
          </Link>
          <h1 className="text-xl font-display font-bold beer-text flex items-center gap-2">
            <Handshake className="w-5 h-5 text-beer-400" />
            Partners
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Intro */}
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-4 text-center">
          <Sparkles className="w-10 h-10 text-beer-400 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-foam-100 mb-1">Our Amazing Partners</h2>
          <p className="text-sm text-foam-500">
            NAPIWAS is made possible thanks to these incredible projects and communities.
          </p>
        </div>

        {/* Partners grid */}
        {loading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-dark-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {displayPartners.map((partner, index) => (
              <motion.a
                key={partner.id}
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="block bg-dark-900 rounded-xl border border-dark-700 p-4 hover:border-beer-500/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-xl bg-dark-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {partner.logo_url ? (
                      <img 
                        src={partner.logo_url} 
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold beer-text">
                        {partner.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foam-100 group-hover:text-beer-400 transition-colors">
                        {partner.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-foam-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-foam-500 mt-1 line-clamp-2">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* Become a partner CTA */}
        <div className="bg-gradient-to-br from-beer-500/20 to-beer-600/20 rounded-xl border border-beer-500/30 p-6 text-center">
          <h3 className="text-lg font-bold text-foam-100 mb-2">Become a Partner</h3>
          <p className="text-sm text-foam-400 mb-4">
            Want to partner with NAPIWAS? We are always looking for exciting collaborations!
          </p>
          <a
            href="https://t.me/napiwas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl beer-gradient text-dark-950 font-bold hover:brightness-110 transition-all"
          >
            Contact Us
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

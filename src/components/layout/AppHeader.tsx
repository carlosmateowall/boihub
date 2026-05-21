'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Dot } from '@/components/shared/Dot'
import { PERFIL_LABELS } from '@/lib/constants'
import type { Profile } from '@/types/database'

interface Props {
  profile: Profile | null
}

/**
 * Header fixo no topo do app, modo mobile.
 * Identidade verde-900 com logo, nome, label do perfil + bell e status.
 */
export function AppHeader({ profile }: Props) {
  const perfilLabel = profile ? PERFIL_LABELS[profile.perfil] : null
  const isOnlineCapable =
    profile?.perfil === 'veterinario' || profile?.perfil === 'motorista'

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-verde-900 text-ink-on-dark px-4 pt-3 pb-3.5">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={24} dark />
          <span className="bh-display text-[18px] tracking-tight">BoiHub</span>
          {perfilLabel && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border border-white/15 text-ink-on-dark-mute">
              {perfilLabel.split(' ')[0]}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3">
          {isOnlineCapable && (
            <span className="inline-flex items-center gap-1.5 text-[11px]">
              <Dot tone="positive" size={6} />
              <span className="text-verde-400 font-semibold">
                {profile?.perfil === 'veterinario' ? 'Aceitando' : 'Disponível'}
              </span>
            </span>
          )}
          <button
            aria-label="Notificações"
            className="p-1.5 -mr-1 text-ink-on-dark hover:text-creme"
          >
            <Bell className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  )
}

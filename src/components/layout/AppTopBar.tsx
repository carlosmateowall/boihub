'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut } from 'lucide-react'
import { Avatar } from '@/components/shared/Avatar'
import { Dot } from '@/components/shared/Dot'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

interface Props {
  profile: Profile | null
}

/**
 * Top bar do desktop. Aparece à direita da Sidebar.
 * Search global (ainda placeholder), bell, status pill, avatar.
 */
export function AppTopBar({ profile }: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const isOnlineCapable =
    profile?.perfil === 'veterinario' || profile?.perfil === 'motorista'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <div className="hidden lg:flex items-center justify-between gap-6 px-10 py-5 border-b border-border bg-creme">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2.5 bg-canvas border border-border rounded-md px-3.5 py-2 w-[360px] max-w-full">
          <Search className="h-4 w-4 text-mute shrink-0" strokeWidth={1.5} />
          <input
            placeholder="Buscar fretes, veterinários, produtos…"
            className="bg-transparent border-0 outline-none flex-1 text-[13.5px] text-ink placeholder:text-mute"
          />
          <kbd className="text-[10.5px] text-mute px-1.5 py-0.5 border border-border rounded font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isOnlineCapable && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-verde-400/10 border border-verde-400/25">
            <Dot tone="positive" size={6} />
            <span className="text-[12.5px] font-semibold text-verde-700">
              {profile?.perfil === 'veterinario'
                ? 'Aceitando consultas'
                : 'Disponível para viagens'}
            </span>
          </div>
        )}
        <button
          aria-label="Notificações"
          className="relative w-10 h-10 inline-flex items-center justify-center bg-canvas border border-border rounded-md text-ink-soft hover:text-ink hover:border-border-strong"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-negative border-2 border-canvas" />
        </button>
        <Avatar
          name={profile?.nome ?? 'BH'}
          src={profile?.foto_url}
          tone="verde"
          size={40}
        />
        <button
          onClick={handleLogout}
          aria-label="Sair"
          className="text-mute hover:text-ink p-1"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

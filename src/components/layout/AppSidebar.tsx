'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, MoreVertical } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { Avatar } from '@/components/shared/Avatar'
import { createClient } from '@/lib/supabase/client'
import { navForPerfil } from '@/lib/nav'
import { PERFIL_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'

interface Props {
  profile: Profile | null
}

export function AppSidebar({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const items = navForPerfil(profile?.perfil)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-[248px] shrink-0 bg-verde-900 text-ink-on-dark min-h-screen px-4 py-6 gap-6">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2">
        <Logo size={28} dark />
        <span className="bh-display text-[22px] tracking-tight">BoiHub</span>
      </Link>

      <div className="px-2">
        <span className="bh-eyebrow text-ink-on-dark-mute">
          {profile ? PERFIL_LABELS[profile.perfil] : 'Carregando…'}
        </span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {items.map((item, idx) => {
          const Icon = item.icon
          const active =
            (item.href === '/dashboard' && pathname === '/dashboard') ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href) && idx > 0)
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors border-l-2 -ml-px',
                active
                  ? 'bg-white/[0.06] text-ink-on-dark border-verde-400'
                  : 'text-ink-on-dark-mute border-transparent hover:bg-white/[0.04] hover:text-ink-on-dark',
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
              <span className={active ? 'font-semibold' : ''}>{item.label}</span>
              {item.badge != null && (
                <span className="ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-verde-400 text-verde-900">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/[0.08] pt-4 flex items-center gap-2.5">
        <Avatar
          name={profile?.nome ?? 'BH'}
          src={profile?.foto_url}
          tone="sand"
          size={36}
        />
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-ink-on-dark truncate">
            {profile?.nome ?? 'Sua conta'}
          </div>
          <div className="text-[11px] text-ink-on-dark-mute truncate">
            {profile?.cidade ?? '—'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          aria-label="Sair"
          className="text-ink-on-dark-mute hover:text-ink-on-dark p-1"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  )
}

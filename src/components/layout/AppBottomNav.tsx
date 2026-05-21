'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navForPerfil } from '@/lib/nav'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'

interface Props {
  profile: Profile | null
}

export function AppBottomNav({ profile }: Props) {
  const pathname = usePathname()
  const items = navForPerfil(profile?.perfil).slice(0, 5)

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border"
      style={{
        background: 'rgba(247, 240, 224, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
      }}
    >
      <div className="grid grid-cols-5">
        {items.map((item, idx) => {
          const Icon = item.icon
          const active =
            (item.href === '/dashboard' && pathname === '/dashboard') ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href) && idx > 0)
          return (
            <Link
              key={`${item.href}-${item.label}-${idx}`}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center gap-0.5 pt-2.5 pb-1 px-1',
                active ? 'text-verde-900' : 'text-mute',
              )}
            >
              {active && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-verde-900" />
              )}
              <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.5} />
              <span
                className={cn(
                  'text-[10.5px]',
                  active ? 'font-semibold' : 'font-medium',
                )}
              >
                {item.shortLabel ?? item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

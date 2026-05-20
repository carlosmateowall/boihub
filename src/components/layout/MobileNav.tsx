'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Truck, HeartPulse, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/fretes', label: 'Fretes', icon: Truck },
  { href: '/saude', label: 'Saúde', icon: HeartPulse },
  { href: '/loja', label: 'Loja', icon: ShoppingBag },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-canvas border-t border-border">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-0',
                active ? 'text-primary' : 'text-mute hover:text-ink'
              )}
            >
              <div className={cn('p-1.5 rounded-xl', active && 'bg-primary-pale')}>
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

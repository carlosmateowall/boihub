'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Truck, HeartPulse, ShoppingBag, Package, User, LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useMemo } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/fretes', label: 'Fretes', icon: Truck },
  { href: '/saude', label: 'Saúde Animal', icon: HeartPulse },
  { href: '/loja', label: 'Loja', icon: ShoppingBag },
  { href: '/suplementos', label: 'Suplementos', icon: Package },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-canvas border-r border-border min-h-screen p-6 gap-8">
      <Link href="/dashboard" className="flex items-center gap-1">
        <span className="font-display font-extrabold text-2xl text-ink">Boi</span>
        <span className="font-display font-extrabold text-2xl text-primary">Hub</span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors',
                active
                  ? 'bg-primary-pale text-primary border-l-2 border-primary pl-3'
                  : 'text-mute hover:bg-white/5 hover:text-ink'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-mute hover:bg-white/5 hover:text-ink transition-colors"
      >
        <LogOut className="h-5 w-5" strokeWidth={1.5} />
        Sair
      </button>
    </aside>
  )
}

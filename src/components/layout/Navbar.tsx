import Link from 'next/link'
import { Bell } from 'lucide-react'

interface NavbarProps {
  title?: string
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="lg:hidden bg-canvas sticky top-0 z-40 flex items-center justify-between px-4 py-4 border-b border-border">
      <Link href="/dashboard" className="flex items-center gap-1">
        <span className="font-display font-extrabold text-xl text-ink">Boi</span>
        <span className="font-display font-extrabold text-xl text-primary">Hub</span>
      </Link>
      {title && <p className="text-sm font-semibold text-mute">{title}</p>}
      <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
        <Bell className="h-5 w-5 text-ink" strokeWidth={1.5} />
      </button>
    </header>
  )
}

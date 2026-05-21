import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Truck,
  HeartPulse,
  ShoppingBag,
  Package,
  User,
  Inbox,
  CalendarDays,
  FileText,
  Wallet,
  Store,
  MessageCircle,
  Sparkles,
} from 'lucide-react'
import type { PerfilTipo } from '@/types/database'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  /** Item curto (5 chars) usado no BottomNav mobile pra caber no chip */
  shortLabel?: string
  /** Badge numérico (ex.: solicitações pendentes pro vet) */
  badge?: number
}

const PRODUTOR: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortLabel: 'Início' },
  { href: '/fretes', label: 'Fretes', icon: Truck },
  { href: '/saude', label: 'Saúde animal', icon: HeartPulse, shortLabel: 'Saúde' },
  { href: '/loja', label: 'Loja', icon: ShoppingBag },
  { href: '/suplementos', label: 'Suplementos', icon: Package, shortLabel: 'Suplem.' },
  { href: '/perfil', label: 'Perfil', icon: User },
]

const VETERINARIO: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortLabel: 'Início' },
  { href: '/saude/consultas', label: 'Solicitações', icon: Inbox, shortLabel: 'Solicit.' },
  { href: '/saude/consultas', label: 'Agenda', icon: CalendarDays },
  { href: '/saude/consultas', label: 'Receitas', icon: FileText },
  { href: '/perfil', label: 'Perfil', icon: User },
]

const MOTORISTA: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortLabel: 'Início' },
  { href: '/fretes', label: 'Fretes', icon: Truck },
  { href: '/fretes', label: 'Em andamento', icon: Truck, shortLabel: 'Viagens' },
  { href: '/fretes', label: 'Receita', icon: Wallet },
  { href: '/perfil', label: 'Perfil', icon: User },
]

const REVENDA: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortLabel: 'Início' },
  { href: '/loja', label: 'Produtos', icon: Package },
  { href: '/loja', label: 'Loja', icon: Store },
  { href: '/loja', label: 'Mensagens', icon: MessageCircle, shortLabel: 'Msgs' },
  { href: '/perfil', label: 'Perfil', icon: User },
]

const FABRICANTE: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortLabel: 'Início' },
  { href: '/loja', label: 'Produtos', icon: Package },
  { href: '/loja', label: 'Lojas parceiras', icon: Store, shortLabel: 'Lojas' },
  { href: '/loja', label: 'Patrocínio', icon: Sparkles, shortLabel: 'Patrocínio' },
  { href: '/perfil', label: 'Perfil', icon: User },
]

export function navForPerfil(perfil: PerfilTipo | null | undefined): NavItem[] {
  switch (perfil) {
    case 'veterinario': return VETERINARIO
    case 'motorista':   return MOTORISTA
    case 'revenda':     return REVENDA
    case 'fabricante':  return FABRICANTE
    case 'produtor':
    default:            return PRODUTOR
  }
}

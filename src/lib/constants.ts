export const PERFIL_LABELS: Record<string, string> = {
  produtor: 'Produtor Rural',
  veterinario: 'Veterinário',
  revenda: 'Revenda',
  fabricante: 'Fabricante',
  motorista: 'Motorista',
}

export const PERFIL_ICONS: Record<string, string> = {
  produtor: 'Tractor',
  veterinario: 'Stethoscope',
  revenda: 'Store',
  fabricante: 'Factory',
  motorista: 'Truck',
}

export const PRODUTO_TIPO_LABELS: Record<string, string> = {
  vacina: 'Vacina',
  anti: 'Antiparasitário',
  antibio: 'Antibiótico',
  vit: 'Vitamina',
}

export const GADO_TIPO_LABELS: Record<string, string> = {
  corte: 'Gado de Corte',
  leite: 'Gado de Leite',
  bezerro: 'Bezerro',
  touro: 'Touro',
}

export const FRETE_STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

export const SUPLEMENTO_CATEGORIA_LABELS: Record<string, string> = {
  mineral: 'Mineral',
  suplemento: 'Suplemento',
  proteinado: 'Proteinado',
  energetico: 'Energético',
  premix: 'Premix',
}

// Contato do time BoiHub.
// TODO Carlos: trocar o WHATSAPP por um número real (Carlos ou Gustavo).
// Formato esperado: somente dígitos com código do país, ex.: 5561XXXXXXXX
export const CONTATO = {
  EMAIL: 'contato@boihub.com.br',
  EMAIL_PRIVACIDADE: 'privacidade@boihub.com.br',
  WHATSAPP: '5561992365437',
} as const

export function whatsappLink(mensagem: string): string {
  const texto = encodeURIComponent(mensagem)
  return `https://wa.me/${CONTATO.WHATSAPP}?text=${texto}`
}

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/fretes', label: 'Fretes', icon: 'Truck' },
  { href: '/saude', label: 'Saúde', icon: 'HeartPulse' },
  { href: '/loja', label: 'Loja', icon: 'ShoppingBag' },
  { href: '/suplementos', label: 'Suplementos', icon: 'Package' },
  { href: '/perfil', label: 'Perfil', icon: 'User' },
]

import { cn } from '@/lib/utils'

export type BadgeVariant =
  | 'neutral'
  | 'positive'
  | 'warning'
  | 'negative'
  | 'primary'
  | 'info'
  | 'gold'
  | 'onDark'
  | 'mute' // alias for neutral, mantido pra compat

export type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral:  'bg-ink/[0.06] text-ink-soft border-transparent',
  mute:     'bg-ink/[0.06] text-ink-soft border-transparent',
  positive: 'bg-verde-400/[0.14] text-verde-700 border-verde-400/30',
  warning:  'bg-ouro/[0.14] text-warning-deep border-ouro/30',
  negative: 'bg-negative/[0.12] text-negative-deep border-negative/25',
  primary:  'bg-verde-900/[0.92] text-creme border-transparent',
  info:     'bg-info/[0.12] text-[#1f4d80] border-info/25',
  gold:     'bg-ouro/[0.10] text-warning-deep border-ouro/35',
  onDark:   'bg-white/10 text-creme border-white/15',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-[3px] text-[12px]',
}

export function Badge({ variant = 'neutral', size = 'md', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold tracking-wide leading-none whitespace-nowrap rounded-pill border',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  )
}

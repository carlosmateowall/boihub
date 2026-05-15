import { cn } from '@/lib/utils'

type BadgeVariant = 'positive' | 'warning' | 'negative' | 'primary' | 'mute'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  positive: 'bg-primary-pale text-positive-deep',
  warning: 'bg-warning text-warning-content',
  negative: 'bg-negative-deep text-white',
  primary: 'bg-primary text-ink',
  mute: 'bg-canvas-soft text-ink border border-ink/15 rounded-sm',
}

export function Badge({ variant = 'primary', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-sm font-semibold px-3 py-1 rounded-pill',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

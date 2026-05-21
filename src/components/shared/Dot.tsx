import { cn } from '@/lib/utils'

interface DotProps {
  tone?: 'positive' | 'warning' | 'danger' | 'mute'
  size?: number
  className?: string
}

const toneClasses: Record<NonNullable<DotProps['tone']>, string> = {
  positive: 'bg-verde-400 shadow-[0_0_0_3px_rgba(74,222,128,0.16)]',
  warning:  'bg-ouro',
  danger:   'bg-negative',
  mute:     'bg-mute',
}

export function Dot({ tone = 'positive', size = 8, className }: DotProps) {
  return (
    <span
      className={cn('inline-block rounded-full shrink-0', toneClasses[tone], className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}

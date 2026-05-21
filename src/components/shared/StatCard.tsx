import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon?: LucideIcon
  label: string
  value: string | number
  suffix?: string
  sub?: string
  delta?: string | number
  deltaTone?: 'positive' | 'danger' | 'neutral'
  emphasis?: 'normal' | 'hero'
  size?: 'sm' | 'md'
  className?: string
}

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  sub,
  delta,
  deltaTone = 'positive',
  emphasis = 'normal',
  size = 'md',
  className,
}: StatCardProps) {
  const isHero = emphasis === 'hero'
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 min-w-0 rounded-lg border',
        isHero
          ? 'bg-verde-900 text-ink-on-dark border-transparent'
          : 'bg-canvas text-ink border-border',
        size === 'sm' ? 'p-4' : isHero ? 'p-5' : 'p-[18px]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span
          className={cn(
            'text-[12px] font-medium lowercase tracking-wide',
            isHero ? 'text-ink-on-dark-mute' : 'text-mute',
          )}
        >
          {label}
        </span>
        {Icon && (
          <Icon
            className={cn('h-4 w-4 shrink-0', isHero ? 'text-verde-400' : 'text-mute')}
            strokeWidth={1.5}
          />
        )}
      </div>

      <div className="flex items-baseline gap-1 min-w-0">
        <span
          className={cn(
            'bh-num leading-none',
            size === 'sm' ? 'text-[30px]' : isHero ? 'text-[42px]' : 'text-[36px]',
          )}
        >
          {value}
        </span>
        {suffix && (
          <span
            className={cn(
              'text-sm font-medium',
              isHero ? 'text-ink-on-dark-mute' : 'text-mute',
            )}
          >
            {suffix}
          </span>
        )}
      </div>

      {(sub || delta != null) && (
        <div className="flex items-center gap-2 mt-0.5">
          {delta != null && (
            <span
              className={cn(
                'text-[12px] font-semibold inline-flex items-center gap-0.5',
                deltaTone === 'positive' && 'text-verde-700',
                deltaTone === 'danger' && 'text-negative-deep',
                deltaTone === 'neutral' && (isHero ? 'text-verde-400' : 'text-mute'),
              )}
            >
              {deltaTone === 'positive' ? '↑' : deltaTone === 'danger' ? '↓' : '·'} {delta}
            </span>
          )}
          {sub && (
            <span
              className={cn(
                'text-[12px]',
                isHero ? 'text-ink-on-dark-mute' : 'text-mute',
              )}
            >
              {sub}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ActionTone = 'light' | 'dark' | 'gold'

interface ActionCardProps {
  icon: LucideIcon
  title: string
  sub: string
  meta?: string
  tone?: ActionTone
  href: string
  external?: boolean
  className?: string
}

const toneCardClasses: Record<ActionTone, string> = {
  light: 'bg-canvas text-ink border-border',
  dark:  'bg-verde-900 text-ink-on-dark border-transparent',
  gold:  'bg-ouro-soft text-warning-content border-ouro/30',
}

const toneIconBoxClasses: Record<ActionTone, string> = {
  light: 'bg-verde-900/[0.06] text-verde-900',
  dark:  'bg-verde-400/[0.12] text-verde-400',
  gold:  'bg-ouro/[0.18] text-[#7a5c0d]',
}

const toneCtaClasses: Record<ActionTone, string> = {
  light: 'text-verde-900',
  dark:  'text-verde-400',
  gold:  'text-[#7a5c0d]',
}

const toneMetaClasses: Record<ActionTone, string> = {
  light: 'text-mute',
  dark:  'text-ink-on-dark-mute',
  gold:  'text-warning-deep',
}

const toneSubClasses: Record<ActionTone, string> = {
  light: 'text-mute',
  dark:  'text-ink-on-dark-mute',
  gold:  'text-warning-deep',
}

export function ActionCard({
  icon: Icon,
  title,
  sub,
  meta,
  tone = 'light',
  href,
  external,
  className,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'flex flex-col gap-3.5 rounded-lg border p-[18px] pb-4 text-left transition-colors hover:border-border-strong group',
        toneCardClasses[tone],
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-md',
            toneIconBoxClasses[tone],
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        {meta && (
          <span
            className={cn(
              'text-[11px] font-semibold uppercase tracking-wider',
              toneMetaClasses[tone],
            )}
          >
            {meta}
          </span>
        )}
      </div>
      <div>
        <p className="bh-display text-lg leading-tight mb-1">{title}</p>
        <p className={cn('text-[13px] leading-snug', toneSubClasses[tone])}>{sub}</p>
      </div>
      <span
        className={cn(
          'inline-flex items-center gap-1 text-[13px] font-semibold',
          toneCtaClasses[tone],
        )}
      >
        Abrir{' '}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

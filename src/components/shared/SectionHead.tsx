import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface SectionHeadProps {
  eyebrow?: string
  title: string
  count?: string | number
  action?: string
  actionHref?: string
  actionExternal?: boolean
}

export function SectionHead({
  eyebrow,
  title,
  count,
  action,
  actionHref,
  actionExternal,
}: SectionHeadProps) {
  return (
    <div className="flex items-end justify-between gap-4 mb-3.5">
      <div className="flex flex-col gap-1 min-w-0">
        {eyebrow && <span className="bh-eyebrow text-mute">{eyebrow}</span>}
        <div className="flex items-baseline gap-2.5">
          <h2 className="bh-display text-[22px] leading-tight text-ink m-0">{title}</h2>
          {count != null && (
            <span className="text-[13px] text-mute tabular-nums">{count}</span>
          )}
        </div>
      </div>
      {action && actionHref && (
        <Link
          href={actionHref}
          target={actionExternal ? '_blank' : undefined}
          rel={actionExternal ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-soft border-b border-border-strong pb-px hover:text-ink"
        >
          {action} <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}

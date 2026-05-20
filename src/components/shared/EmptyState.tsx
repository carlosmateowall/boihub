import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  actionExternal?: boolean
  onAction?: () => void
  secondaryLabel?: string
  secondaryHref?: string
  secondaryExternal?: boolean
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionExternal,
  onAction,
  secondaryLabel,
  secondaryHref,
  secondaryExternal,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-canvas-soft">
        <Icon className="h-8 w-8 text-mute" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-1.5 max-w-sm">
        <p className="font-semibold text-ink">{title}</p>
        <p className="text-sm text-mute">{description}</p>
      </div>
      {(actionLabel || secondaryLabel) && (
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          {actionLabel && actionHref && (
            <Button variant="primary" size="sm" asChild>
              <Link
                href={actionHref}
                target={actionExternal ? '_blank' : undefined}
                rel={actionExternal ? 'noopener noreferrer' : undefined}
              >
                {actionLabel}
              </Link>
            </Button>
          )}
          {actionLabel && !actionHref && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryLabel && secondaryHref && (
            <Button variant="secondary" size="sm" asChild>
              <Link
                href={secondaryHref}
                target={secondaryExternal ? '_blank' : undefined}
                rel={secondaryExternal ? 'noopener noreferrer' : undefined}
              >
                {secondaryLabel}
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

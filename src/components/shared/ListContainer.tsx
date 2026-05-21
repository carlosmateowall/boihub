import { cn } from '@/lib/utils'

export function ListContainer({
  children,
  title,
  className,
}: {
  children: React.ReactNode
  title?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'bg-canvas border border-border rounded-lg overflow-hidden',
        className,
      )}
    >
      {title && (
        <div className="px-[18px] py-3 border-b border-border bg-canvas-warm">
          <span className="bh-eyebrow text-mute">{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}

export function ListRow({
  children,
  divider = true,
  dense = false,
  className,
}: {
  children: React.ReactNode
  divider?: boolean
  dense?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-canvas',
        dense ? 'px-4 py-3' : 'px-[18px] py-3.5',
        divider ? 'border-b border-border last:border-b-0' : '',
        className,
      )}
    >
      {children}
    </div>
  )
}

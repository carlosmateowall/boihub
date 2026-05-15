import { cn } from '@/lib/utils'

interface LoadingCardProps {
  className?: string
  lines?: number
}

export function LoadingCard({ className, lines = 3 }: LoadingCardProps) {
  return (
    <div className={cn('bg-canvas rounded-xl p-6 flex flex-col gap-3', className)}>
      <div className="h-5 w-2/3 rounded-md bg-canvas-soft animate-pulse" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 rounded-md bg-canvas-soft animate-pulse',
            i === lines - 2 ? 'w-1/2' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

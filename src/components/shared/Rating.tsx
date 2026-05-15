import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  count?: number
  className?: string
}

export function Rating({ value, count, className }: RatingProps) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <Star className="h-4 w-4 fill-primary text-primary" />
      <span className="text-sm font-semibold text-ink">{value.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-sm text-mute">({count})</span>
      )}
    </span>
  )
}

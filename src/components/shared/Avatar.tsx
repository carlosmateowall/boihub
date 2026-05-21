import Image from 'next/image'
import { cn } from '@/lib/utils'

type AvatarTone = 'verde' | 'ouro' | 'azul' | 'terra' | 'sand'

interface AvatarProps {
  name?: string | null
  src?: string | null
  size?: number
  tone?: AvatarTone
  className?: string
}

const toneClasses: Record<AvatarTone, string> = {
  verde: 'bg-verde-700 text-verde-200',
  ouro:  'bg-ouro text-creme',
  azul:  'bg-info text-info-soft',
  terra: 'bg-[#8a5a3c] text-[#f7e8d8]',
  sand:  'bg-border text-ink',
}

function initialsFrom(name?: string | null): string {
  if (!name) return '··'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || '··'
}

export function Avatar({ name, src, size = 40, tone = 'verde', className }: AvatarProps) {
  if (src) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center overflow-hidden rounded-full shrink-0',
          className,
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={name ?? 'Avatar'}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          unoptimized
        />
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full shrink-0 font-semibold tracking-wide',
        toneClasses[tone],
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        letterSpacing: '0.5px',
      }}
      aria-hidden="true"
    >
      {initialsFrom(name)}
    </span>
  )
}

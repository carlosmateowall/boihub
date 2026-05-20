'use client'

import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder = 'Buscar...', className }: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" strokeWidth={1.5} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-canvas text-ink border border-ink rounded-md',
          'pl-11 pr-10 py-3 text-sm placeholder:text-mute',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-mute hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

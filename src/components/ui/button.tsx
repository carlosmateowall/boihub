'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'bg-primary text-black rounded-xl hover:bg-primary-hover',
        secondary: 'bg-canvas text-ink rounded-xl border border-border hover:bg-white/10',
        tertiary:  'bg-transparent text-ink rounded-xl border border-border-strong hover:bg-white/10',
        ghost:     'text-ink rounded-xl hover:bg-white/5',
        glass:     'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20',
        danger:    'bg-negative text-white rounded-xl hover:bg-negative-deep',
      },
      size: {
        sm:   'px-4 py-2 text-sm',
        md:   'px-6 py-3 text-base',
        lg:   'px-8 py-4 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

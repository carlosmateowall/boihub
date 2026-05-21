'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 button-md',
  {
    variants: {
      variant: {
        primary:   'bg-verde-900 text-creme rounded-md hover:bg-verde-700',
        accent:    'bg-verde-400 text-verde-900 rounded-md hover:bg-verde-200',
        gold:      'bg-ouro text-[#1a1206] rounded-md hover:bg-[#a47e22]',
        secondary: 'bg-canvas text-ink border border-border-strong rounded-md hover:bg-canvas-warm',
        outline:   'bg-transparent text-ink border border-border-strong rounded-md hover:bg-canvas-warm',
        tertiary:  'bg-transparent text-ink rounded-md hover:bg-canvas-warm',
        ghost:     'text-ink rounded-md hover:bg-canvas-warm',
        glass:     'bg-canvas/40 backdrop-blur-sm border border-border text-ink rounded-md hover:bg-canvas/60',
        danger:    'bg-negative text-white rounded-md hover:bg-negative-deep',
      },
      size: {
        sm:   'px-3 py-1.5 text-[13px] h-8',
        md:   'px-4 py-2.5 text-[14px] h-10',
        lg:   'px-5 py-3 text-[15px] h-12',
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

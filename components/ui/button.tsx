import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#2E4A9E] text-white hover:bg-[#1E3570] hover:-translate-y-0.5 transition-transform',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border-2 border-[#2E4A9E] text-[#2E4A9E] bg-transparent hover:bg-[#2E4A9E] hover:text-white',
        secondary:
          'bg-[#8DC63F] text-white hover:bg-[#5C9024] hover:-translate-y-0.5 transition-transform',
        ghost: 'hover:bg-[#F6F5F1] hover:text-[#2E4A9E]',
        link: 'text-[#2E4A9E] underline-offset-4 hover:underline',
        orange: 'bg-[#F26522] text-white hover:bg-[#C94F16] hover:-translate-y-0.5 transition-transform shadow-lg',
        blue: 'bg-[#2E4A9E] text-white hover:bg-[#1E3570] hover:-translate-y-0.5 transition-transform',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

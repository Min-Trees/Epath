import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#3A53A3] text-white hover:bg-[#2E4389] hover:-translate-y-0.5 transition-transform',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border-2 border-[#3A53A3] text-[#3A53A3] bg-transparent hover:bg-[#3A53A3] hover:text-white',
        secondary:
          'bg-[#8BC53F] text-white hover:bg-[#B7D333] hover:-translate-y-0.5 transition-transform',
        ghost: 'hover:bg-[#3A53A3] hover:text-white',
        link: 'text-[#3A53A3] underline-offset-4 hover:underline',
        orange: 'bg-[#F05A28] text-white hover:bg-[#E04D1A] hover:-translate-y-0.5 transition-transform',
        blue: 'bg-[#3A53A3] text-white hover:bg-[#4B63B3] hover:-translate-y-0.5 transition-transform',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
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

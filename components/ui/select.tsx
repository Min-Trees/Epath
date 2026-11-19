'use client'

import * as React from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        // RESPONSIVE NOTE (tap target):
        // h-10 = 40px, below the 44px guideline on phones.
        // Mobile uses h-11 (44px); desktop keeps the original h-10.
        className={`flex h-11 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

export const SelectTrigger = Select

export interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export function SelectContent({ children, className }: SelectContentProps) {
  return <div className={className}>{children}</div>
}

export interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode
}

export function SelectItem({ children, ...props }: SelectItemProps) {
  return <option {...props}>{children}</option>
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <>{placeholder || '—'}</>
}

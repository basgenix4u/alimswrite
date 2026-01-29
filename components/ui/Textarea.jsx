// components/ui/Textarea.jsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Textarea = forwardRef(({
  label,
  error,
  helper,
  className,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full px-4 py-3 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-dark-500">{helper}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
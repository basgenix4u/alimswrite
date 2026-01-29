// components/ui/Select.jsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { FiChevronDown } from 'react-icons/fi'

const Select = forwardRef(({
  label,
  error,
  helper,
  options = [],
  placeholder = 'Select an option',
  className,
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
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-dark-500">{helper}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
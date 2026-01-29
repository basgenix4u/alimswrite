// components/ui/Card.jsx
import { cn } from '@/lib/utils'

export default function Card({
  children,
  className,
  hover = true,
  padding = true,
  ...props
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md',
        hover && 'hover:shadow-lg transition-shadow duration-200',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-xl font-semibold text-dark-900', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-dark-500 mt-1', className)}>
      {children}
    </p>
  )
}

export function CardContent({ children, className }) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-dark-100', className)}>
      {children}
    </div>
  )
}
// components/ui/EmptyState.jsx
import Link from 'next/link'
import Button from './Button'
import { FiSearch, FiFileText, FiInbox } from 'react-icons/fi'

const icons = {
  search: FiSearch,
  document: FiFileText,
  inbox: FiInbox,
}

export default function EmptyState({
  icon = 'inbox',
  title = 'No results found',
  description = 'We could not find what you are looking for.',
  actionLabel,
  actionHref,
  onAction,
}) {
  const IconComponent = icons[icon] || FiInbox

  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconComponent className="w-8 h-8 text-dark-400" />
      </div>
      <h3 className="text-lg font-semibold text-dark-900 mb-2">{title}</h3>
      <p className="text-dark-500 max-w-sm mx-auto mb-6">{description}</p>
      
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button variant="primary">{actionLabel}</Button>
          </Link>
        ) : (
          <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  )
}

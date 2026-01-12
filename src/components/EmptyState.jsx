import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionHref,
  onAction
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full mb-6 shadow-sm">
        <Icon size={40} className="text-orange-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg leading-relaxed">
        {description}
      </p>
      {(actionLabel && (actionHref || onAction)) && (
        <div className="flex justify-center">
          {actionHref ? (
            <Link 
              to={actionHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              {actionLabel}
              <ArrowRight size={18} />
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              {actionLabel}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

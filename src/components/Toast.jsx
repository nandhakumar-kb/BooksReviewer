import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const STYLES = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
}

const ICON_STYLES = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  warning: 'text-amber-600',
}

export default function Toast({ message, type = 'info', onClose, duration = 5000 }) {
  const Icon = ICONS[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div 
      className={`relative animate-slide-in-right shadow-lg ${STYLES[type]} border rounded-lg p-4 flex items-start gap-3`} 
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <Icon className={`flex-shrink-0 ${ICON_STYLES[type]}`} size={20} aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  )
}

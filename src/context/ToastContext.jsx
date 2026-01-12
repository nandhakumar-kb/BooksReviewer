import { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-20 right-4 z-[70] space-y-2 max-w-md pointer-events-none">
        {toasts.map(({ id, message, type, duration }) => (
          <div key={id} className="pointer-events-auto">
            <Toast
              message={message}
              type={type}
              duration={duration}
              onClose={() => removeToast(id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

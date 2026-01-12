import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isAdmin } from '../lib/adminAuth'
import { Loader } from 'lucide-react'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-orange-500" size={48} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login?redirect=/admin" replace />
  }

  if (!isAdmin(user.email)) {
    return <Navigate to="/" replace />
  }

  return children
}

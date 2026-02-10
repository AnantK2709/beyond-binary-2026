import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Spinner from '../common/Spinner'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  // Auto-login is handled in AuthContext, so user should always exist
  // But keep this check for safety
  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute

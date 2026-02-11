import { Navigate } from 'react-router-dom';
import { Flower2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-bounce-gentle"><Flower2 size={56} className="text-sage-400 mx-auto" /></div>
          <div className="text-xl font-semibold text-sage-600">Loading...</div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/signin" />;
}
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'

function Navbar() {
  const navigate = useNavigate()
  const { user, signout } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b border-sage-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-sage-700">Community Wellbeing</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-sage-600 transition-colors">
              Dashboard
            </Link>
            <Link to="/communities" className="text-gray-700 hover:text-sage-600 transition-colors">
              Communities
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-sage-600 transition-colors">
              Events
            </Link>
            <Link to="/journal" className="text-gray-700 hover:text-sage-600 transition-colors">
              Journal
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-sage-600 transition-colors">
              Profile
            </Link>
          </div>

          {/* Quick Chat Link */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/communities/c001')}
              className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors text-sm font-medium"
            >
              💬 Chat
            </button>
            
            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:inline">{user.name}</span>
                <button
                  onClick={signout}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

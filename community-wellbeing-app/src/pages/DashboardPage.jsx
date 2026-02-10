import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-ocean-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Your wellbeing journey dashboard</p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Chat - Featured */}
          <div 
            onClick={() => navigate('/communities/c001')}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-sage-200 hover:border-sage-400"
          >
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Group Chat</h3>
            <p className="text-gray-600 mb-4">Join community discussions</p>
            <button className="w-full px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors">
              Go to Chat →
            </button>
          </div>

          {/* Communities */}
          <div 
            onClick={() => navigate('/communities')}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Communities</h3>
            <p className="text-gray-600 mb-4">Explore communities</p>
            <button className="w-full px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors">
              Browse →
            </button>
          </div>

          {/* Events */}
          <div 
            onClick={() => navigate('/events')}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Events</h3>
            <p className="text-gray-600 mb-4">Discover events</p>
            <button className="w-full px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors">
              Explore →
            </button>
          </div>

          {/* Journal */}
          <div 
            onClick={() => navigate('/journal')}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="text-4xl mb-4">📔</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Journal</h3>
            <p className="text-gray-600 mb-4">Voice & text journaling</p>
            <button className="w-full px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors">
              Open →
            </button>
          </div>

          {/* Profile */}
          <div 
            onClick={() => navigate('/profile')}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Profile</h3>
            <p className="text-gray-600 mb-4">View your profile</p>
            <button className="w-full px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors">
              View →
            </button>
          </div>

          {/* Recommendations */}
          <div 
            onClick={() => navigate('/recommendations')}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Recommendations</h3>
            <p className="text-gray-600 mb-4">Personalized suggestions</p>
            <button className="w-full px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors">
              View →
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/communities/c001')}
              className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
            >
              💬 Test Group Chat (c001)
            </button>
            <button
              onClick={() => navigate('/communities/c002')}
              className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
            >
              💬 Test Chat (c002)
            </button>
            <button
              onClick={() => navigate('/communities/c003')}
              className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
            >
              💬 Test Chat (c003)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

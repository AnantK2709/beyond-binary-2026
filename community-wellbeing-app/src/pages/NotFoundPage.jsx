import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-white to-ocean-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl mb-6 animate-bounce-gentle">🌿</div>
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mb-8">
          Oops! This page seems to have wandered off the path
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary px-8 py-3"
        >
          Return Home
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage

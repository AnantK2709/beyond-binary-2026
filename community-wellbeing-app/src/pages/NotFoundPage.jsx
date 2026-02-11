import { useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-white to-ocean-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6 flex justify-center animate-bounce-gentle"><Leaf size={80} className="text-sage-500" /></div>
        <h1 className="text-6xl font-bold mb-4 text-gray-800 font-heading">404</h1>
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

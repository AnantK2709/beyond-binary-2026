import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signup = async (userData) => {
    // Mock signup
    const newUser = {
      id: `u${Date.now()}`,
      ...userData,
      points: 0,
      level: 1,
      // Interests will be added by your colleague's onboarding flow
      interests: userData.interests || []
    }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    localStorage.setItem('token', 'mock-token-123')
    navigate('/onboarding')
  }

  const signin = async (email, password) => {
    // Mock signin - check against hardcoded users
    const mockUser = {
      id: 'u123',
      email,
      name: 'Sarah Chen',
      points: 450,
      level: 3,
      // Sample interests for testing matching algorithm
      // Your colleague's signup flow can replace this with real user interests
      interests: ['wellness', 'yoga', 'meditation', 'mindfulness', 'social', 'outdoors']
    }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('token', 'mock-token-123')
    navigate('/dashboard')
  }

  const signout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

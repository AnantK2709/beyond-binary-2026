import { createContext, useState, useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserProfile(user.id)
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  const loadUserProfile = async (userId) => {
    // Load from localStorage or mock data
    const storedProfile = localStorage.getItem(`profile_${userId}`)
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    } else {
      // Default profile
      setProfile({
        ...user,
        interests: [],
        availability: {},
        rsvpEvents: [],
        communities: []
      })
    }
    setLoading(false)
  }

  const updateProfile = async (updates) => {
    const updatedProfile = { ...profile, ...updates }
    setProfile(updatedProfile)
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile))
  }

  const awardPoints = (points) => {
    const newPoints = profile.points + points
    const newLevel = Math.floor(newPoints / 500) + 1
    const leveledUp = newLevel > profile.level

    const updatedProfile = {
      ...profile,
      points: newPoints,
      level: newLevel
    }
    setProfile(updatedProfile)
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile))

    return { leveledUp, newLevel, newPoints }
  }

  return (
    <UserContext.Provider value={{ profile, loading, updateProfile, awardPoints }}>
      {children}
    </UserContext.Provider>
  )
}

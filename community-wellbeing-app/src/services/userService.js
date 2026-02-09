import { mockApiCall } from './api'

export const userService = {
  getProfile: async (userId) => {
    const storedProfile = localStorage.getItem(`profile_${userId}`)
    if (storedProfile) {
      return mockApiCall(JSON.parse(storedProfile))
    }
    return mockApiCall(null)
  },

  updateProfile: async (userId, updates) => {
    const profile = JSON.parse(localStorage.getItem(`profile_${userId}`) || '{}')
    const updated = { ...profile, ...updates }
    localStorage.setItem(`profile_${userId}`, JSON.stringify(updated))
    return mockApiCall(updated)
  },

  getConnections: async (userId) => {
    const connections = JSON.parse(localStorage.getItem(`connections_${userId}`) || '[]')
    return mockApiCall({ connections })
  },

  addConnection: async (userId, connectionId) => {
    const connections = JSON.parse(localStorage.getItem(`connections_${userId}`) || '[]')
    if (!connections.includes(connectionId)) {
      connections.push(connectionId)
      localStorage.setItem(`connections_${userId}`, JSON.stringify(connections))
    }
    return mockApiCall({ success: true })
  }
}

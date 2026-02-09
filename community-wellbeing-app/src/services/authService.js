import { mockApiCall } from './api'

export const authService = {
  signup: async (userData) => {
    const newUser = {
      id: `u${Date.now()}`,
      ...userData,
      points: 0,
      level: 1,
      createdAt: new Date().toISOString()
    }
    return mockApiCall({ user: newUser, token: 'mock-token-123' })
  },

  signin: async (email, password) => {
    // Mock authentication
    const mockUser = {
      id: 'u123',
      email,
      name: 'Sarah Chen',
      points: 450,
      level: 3
    }
    return mockApiCall({ user: mockUser, token: 'mock-token-123' })
  },

  signout: async () => {
    return mockApiCall({ success: true })
  },

  verifyToken: async (token) => {
    return mockApiCall({ valid: true })
  }
}
